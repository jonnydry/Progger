import type { Express } from "express";
import { createServer, type Server } from "http";
import { csrfSync } from "csrf-sync";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, type AuthenticatedUser } from "./replitAuth";
import { generateChordProgression, analyzeCustomProgression } from "./xaiService";
import { ValidationError } from "./utils/validation";
import { validateProgressionRequestMiddleware, validateStashRequestMiddleware } from "./middleware/validation";
import { validateCustomProgressionRequest } from "./utils/validation";
import { logger } from "./utils/logger";
import { db } from "./db";
import { redisCache } from "./cache";
import { createAIGenerationLimiter, getRateLimitStatus } from "./rateLimit";
import { requestIdMiddleware } from "./middleware/requestId";

// CSRF protection for session-based endpoints
const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) => {
    // Check both header and body for CSRF token
    return req.headers['x-csrf-token'] as string || req.body?._csrf;
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Redis-backed rate limiter (async to properly connect)
  // Falls back to in-memory if Redis is unavailable
  const aiGenerationLimiter = await createAIGenerationLimiter();

  // Request ID middleware - must be first to ensure all requests have IDs
  app.use(requestIdMiddleware);

  await setupAuth(app);

  // CSRF token endpoint - provides token for client-side requests
  app.get('/api/csrf-token', (req, res) => {
    const token = generateToken(req);
    // Explicitly save session to ensure token persists with saveUninitialized: false
    req.session.save((err) => {
      if (err) {
        logger.error('Failed to save session for CSRF token', { error: err.message });
        return res.status(500).json({ error: 'Failed to generate CSRF token' });
      }
      res.json({ token });
    });
  });

  // Health check endpoint
  app.get('/api/health', async (_req, res) => {
    const rateLimitStatus = getRateLimitStatus();
    const health = {
      status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected' as 'connected' | 'disconnected',
      redis: 'unavailable' as 'connected' | 'disconnected' | 'unavailable',
      rateLimit: rateLimitStatus,
      uptime: process.uptime(),
    };

    // Check database connectivity
    try {
      await db.execute('SELECT 1');
      health.database = 'connected';
    } catch (error) {
      logger.warn('Database health check failed', { error });
      health.database = 'disconnected';
      health.status = 'degraded';
    }

    // Check Redis connectivity (optional)
    try {
      const testKey = `health:check:${Date.now()}`;
      await redisCache.set(testKey, 'ok', 1);
      const result = await redisCache.get(testKey);
      if (result === 'ok') {
        await redisCache.delete(testKey);
        health.redis = 'connected';
      } else {
        health.redis = 'disconnected';
      }
    } catch (error) {
      logger.debug('Redis health check failed (Redis may not be configured)', { error });
      health.redis = 'unavailable';
      // Redis is optional, so don't degrade health status
    }

    // Determine overall status
    if (health.database === 'disconnected') {
      health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(health);
  });

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const userId = user.claims.sub;
      const dbUser = await storage.getUser(userId);
      // User data - short cache, must revalidate
      res.set('Cache-Control', 'private, max-age=60, must-revalidate');
      res.json(dbUser);
    } catch (error) {
      logger.error("Error fetching user", error, { requestId: req.id, userId: (req.user as AuthenticatedUser)?.claims?.sub });
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/generate-progression', csrfSynchronisedProtection, aiGenerationLimiter, validateProgressionRequestMiddleware, async (req, res) => {
    try {
      // Request body is already validated by middleware
      const {
        key,
        mode,
        includeTensions,
        generationStyle,
        numChords,
        selectedProgression,
      } = req.body;

      // Log the received parameters to trace chord count through the pipeline
      logger.info("POST /api/generate-progression - Request received", {
        requestId: req.id,
        key,
        mode,
        includeTensions,
        generationStyle,
        numChords,
        selectedProgression,
        numChordsType: typeof numChords,
      });

      const result = await generateChordProgression(
        key,
        mode,
        includeTensions,
        generationStyle,
        numChords,
        selectedProgression
      );

      // Verify chord count matches request
      if (result.progression.length !== numChords) {
        logger.warn("Chord count mismatch detected", {
          requestId: req.id,
          requestedNumChords: numChords,
          returnedChordCount: result.progression.length,
          key,
          mode,
          selectedProgression,
        });
      }

      logger.info("Chord progression generated successfully", {
        requestId: req.id,
        key,
        mode,
        requestedNumChords: numChords,
        returnedChordCount: result.progression.length,
        chordCountMatch: result.progression.length === numChords,
      });

      // Set cache headers - results are cached for 24 hours
      res.set('Cache-Control', 'public, max-age=86400');
      res.json(result);
    } catch (error) {
      logger.error("Error in /api/generate-progression", error, {
        requestId: req.id,
        body: req.body,
      });

      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post('/api/analyze-custom-progression', csrfSynchronisedProtection, aiGenerationLimiter, async (req, res) => {
    try {
      const { chords } = validateCustomProgressionRequest(req.body);

      const result = await analyzeCustomProgression(chords);

      logger.info("Custom progression analyzed successfully", {
        requestId: req.id,
        chordCount: chords.length,
        resultChordCount: result.progression.length,
        scaleCount: result.scales.length,
      });

      // Set cache headers - results are cached for 24 hours
      res.set('Cache-Control', 'public, max-age=86400');
      res.json(result);
    } catch (error) {
      logger.error("Error in /api/analyze-custom-progression", error, {
        requestId: req.id,
        body: req.body,
      });
      
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(500).json({ error: errorMessage });
      }
    }
  });

  // Stash routes - require authentication
  app.get('/api/stash', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const userId = user.claims.sub;

      // Parse pagination query parameters (optional for backward compatibility)
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

      // Validate pagination parameters
      if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
        return res.status(400).json({ message: "Invalid limit parameter. Must be between 1 and 100." });
      }
      if (offset !== undefined && (isNaN(offset) || offset < 0)) {
        return res.status(400).json({ message: "Invalid offset parameter. Must be 0 or greater." });
      }
      // Offset requires limit to be specified
      if (offset !== undefined && offset > 0 && (limit === undefined || limit <= 0)) {
        return res.status(400).json({ message: "Offset requires a valid limit parameter to be specified." });
      }

      const items = await storage.getUserStashItems(userId, limit, offset);
      logger.debug("Fetched stash items", { requestId: req.id, userId, itemCount: items.length, limit, offset });
      // User-specific data - short cache, must revalidate
      res.set('Cache-Control', 'private, max-age=60, must-revalidate');
      res.json(items);
    } catch (error) {
      logger.error("Error fetching stash items", error, {
        requestId: req.id,
        userId: (req.user as AuthenticatedUser)?.claims?.sub,
      });
      res.status(500).json({ message: "Failed to fetch stash items" });
    }
  });

  app.post('/api/stash', csrfSynchronisedProtection, isAuthenticated, validateStashRequestMiddleware, async (req, res) => {
    // Note: Request size is already limited by express.json({ limit: '10mb' }) middleware
    // Stash items typically contain progression data which is well under this limit
    try {
      const user = req.user as AuthenticatedUser;
      const userId = user.claims.sub;
      const { name, key, mode, progressionData } = req.body;

      // Request body is already validated by middleware
      const newItem = await storage.createStashItem({
        userId,
        name,
        key,
        mode,
        progressionData,
      });

      logger.info("Stash item created", { requestId: req.id, userId, itemId: newItem.id, name });
      // Newly created data - no cache
      res.set('Cache-Control', 'no-cache');
      res.status(201).json(newItem);
    } catch (error) {
      logger.error("Error creating stash item", error, {
        requestId: req.id,
        userId: (req.user as AuthenticatedUser)?.claims?.sub,
        body: req.body,
      });
      res.status(500).json({ message: "Failed to create stash item" });
    }
  });

  app.delete('/api/stash/:id', csrfSynchronisedProtection, isAuthenticated, async (req, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const userId = user.claims.sub;
      const { id } = req.params;

      await storage.deleteStashItem(id, userId);
      logger.info("Stash item deleted", { requestId: req.id, userId, itemId: id });
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found or unauthorized')) {
        logger.warn("Stash item not found or unauthorized", {
          requestId: req.id,
          userId: (req.user as AuthenticatedUser)?.claims?.sub,
          itemId: req.params.id,
        });
        return res.status(404).json({ message: "Stash item not found" });
      }
      logger.error("Error deleting stash item", error, {
        requestId: req.id,
        userId: (req.user as AuthenticatedUser)?.claims?.sub,
        itemId: req.params.id,
      });
      res.status(500).json({ message: "Failed to delete stash item" });
    }
  });

  // CSRF error handling middleware - must come after routes
  app.use((err: any, req: any, res: any, next: any) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
      logger.warn('CSRF token validation failed', {
        requestId: req.id,
        ip: req.ip,
        path: req.path,
        userAgent: req.get('user-agent'),
      });
      return res.status(403).json({
        error: 'Invalid CSRF token. Please refresh the page and try again.'
      });
    }
    next(err);
  });

  // Global error handling middleware - catches all unhandled errors
  app.use((err: any, req: any, res: any, _next: any) => {
    const requestId = req.id || 'unknown';
    logger.error('Unhandled error', {
      requestId,
      error: err.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });

    // Don't leak error details in production
    const message = process.env.NODE_ENV === 'development'
      ? err.message
      : 'An unexpected error occurred';

    res.status(err.status || 500).json({
      error: message,
      requestId,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
