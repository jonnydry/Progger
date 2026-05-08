import type { Express } from "express";
import { createServer, type Server } from "http";
import { csrfSync } from "csrf-sync";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  validateProgressionRequestMiddleware,
  validateStashRequestMiddleware,
} from "./middleware/validation";
import { logger } from "./utils/logger";
import { isDevelopment } from "./env";
import { db } from "./db";
import { redisCache } from "./cache";
import { createAIGenerationLimiter, getRateLimitStatus } from "./rateLimit";
import { requestIdMiddleware } from "./middleware/requestId";
import { handleGetUser } from "./controllers/authController";
import {
  handleGenerateProgression,
  handleAnalyzeCustomProgression,
} from "./controllers/aiController";
import {
  handleGetStash,
  handleCreateStashItem,
  handleDeleteStashItem,
} from "./controllers/stashController";

// CSRF protection for session-based endpoints
const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) => {
    return (req.headers["x-csrf-token"] as string) || req.body?._csrf;
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const aiGenerationLimiter = await createAIGenerationLimiter();

  app.use(requestIdMiddleware);

  await setupAuth(app);

  // CSRF token endpoint
  app.get("/api/csrf-token", (req, res) => {
    const token = generateToken(req);
    req.session.save((err) => {
      if (err) {
        logger.error("Failed to save session for CSRF token", { error: err.message });
        return res.status(500).json({ error: "Failed to generate CSRF token" });
      }
      res.json({ token });
    });
  });

  // Health check endpoint
  app.get("/api/health", async (_req, res) => {
    const rateLimitStatus = getRateLimitStatus();
    const health = {
      status: "healthy" as "healthy" | "degraded" | "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected" as "connected" | "disconnected",
      redis: "unavailable" as "connected" | "disconnected" | "unavailable",
      rateLimit: rateLimitStatus,
      uptime: process.uptime(),
    };

    try {
      await db.execute("SELECT 1");
      health.database = "connected";
    } catch (error) {
      logger.warn("Database health check failed", { error });
      health.database = "disconnected";
      health.status = "degraded";
    }

    try {
      const testKey = `health:check:${Date.now()}`;
      await redisCache.set(testKey, "ok", 1);
      const result = await redisCache.get(testKey);
      if (result === "ok") {
        await redisCache.delete(testKey);
        health.redis = "connected";
      } else {
        health.redis = "disconnected";
      }
    } catch (error) {
      logger.debug("Redis health check failed (Redis may not be configured)", { error });
      health.redis = "unavailable";
    }

    if (health.database === "disconnected") {
      health.status = "unhealthy";
    }

    const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 200 : 503;
    res.status(statusCode).json(health);
  });

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, handleGetUser);

  // AI generation routes
  app.post(
    "/api/generate-progression",
    csrfSynchronisedProtection,
    aiGenerationLimiter,
    validateProgressionRequestMiddleware,
    handleGenerateProgression
  );
  app.post(
    "/api/analyze-custom-progression",
    csrfSynchronisedProtection,
    aiGenerationLimiter,
    handleAnalyzeCustomProgression
  );

  // Stash routes — require authentication
  app.get("/api/stash", isAuthenticated, handleGetStash);
  app.post(
    "/api/stash",
    csrfSynchronisedProtection,
    isAuthenticated,
    validateStashRequestMiddleware,
    handleCreateStashItem
  );
  app.delete("/api/stash/:id", csrfSynchronisedProtection, isAuthenticated, handleDeleteStashItem);

  // CSRF error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    if (err && err.code === "EBADCSRFTOKEN") {
      logger.warn("CSRF token validation failed", {
        requestId: req.id,
        ip: req.ip,
        path: req.path,
        userAgent: req.get("user-agent"),
      });
      return res.status(403).json({
        error: "Invalid CSRF token. Please refresh the page and try again.",
      });
    }
    next(err);
  });

  // Global error handling middleware
  app.use((err: any, req: any, res: any, _next: any) => {
    const requestId = req.id || "unknown";
    logger.error("Unhandled error", {
      requestId,
      error: err.message || "Unknown error",
      stack: isDevelopment ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });

    const message = isDevelopment ? err.message : "An unexpected error occurred";

    res.status(err.status || 500).json({
      error: message,
      requestId,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
