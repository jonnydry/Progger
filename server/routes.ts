import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, type AuthenticatedUser } from "./replitAuth";
import { generateChordProgression, analyzeCustomProgression } from "./xaiService";
import { ValidationError } from "./utils/validation";
import { validateProgressionRequestMiddleware, validateStashRequestMiddleware } from "./middleware/validation";
import { validateCustomProgressionRequest } from "./utils/validation";
import { logger } from "./utils/logger";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const userId = user.claims.sub;
      const dbUser = await storage.getUser(userId);
      res.json(dbUser);
    } catch (error) {
      logger.error("Error fetching user", error, { userId: (req.user as AuthenticatedUser)?.claims?.sub });
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/generate-progression', validateProgressionRequestMiddleware, async (req, res) => {
    try {
      // Request body is already validated by middleware
      const { key, mode, includeTensions, numChords, selectedProgression } = req.body;

      const result = await generateChordProgression(
        key,
        mode,
        includeTensions,
        numChords,
        selectedProgression
      );

      logger.info("Chord progression generated successfully", {
        key,
        mode,
        numChords,
        chordCount: result.progression.length,
      });

      res.json(result);
    } catch (error) {
      logger.error("Error in /api/generate-progression", error, {
        body: req.body,
      });
      
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post('/api/analyze-custom-progression', async (req, res) => {
    try {
      const { chords } = validateCustomProgressionRequest(req.body);

      const result = await analyzeCustomProgression(chords);

      logger.info("Custom progression analyzed successfully", {
        chordCount: chords.length,
        resultChordCount: result.progression.length,
        scaleCount: result.scales.length,
      });

      res.json(result);
    } catch (error) {
      logger.error("Error in /api/analyze-custom-progression", error, {
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
      const items = await storage.getUserStashItems(userId);
      logger.debug("Fetched stash items", { userId, itemCount: items.length });
      res.json(items);
    } catch (error) {
      logger.error("Error fetching stash items", error, {
        userId: (req.user as AuthenticatedUser)?.claims?.sub,
      });
      res.status(500).json({ message: "Failed to fetch stash items" });
    }
  });

  app.post('/api/stash', isAuthenticated, validateStashRequestMiddleware, async (req, res) => {
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

      logger.info("Stash item created", { userId, itemId: newItem.id, name });
      res.status(201).json(newItem);
    } catch (error) {
      logger.error("Error creating stash item", error, {
        userId: (req.user as AuthenticatedUser)?.claims?.sub,
        body: req.body,
      });
      res.status(500).json({ message: "Failed to create stash item" });
    }
  });

  app.delete('/api/stash/:id', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as AuthenticatedUser;
      const userId = user.claims.sub;
      const { id } = req.params;

      await storage.deleteStashItem(id, userId);
      logger.info("Stash item deleted", { userId, itemId: id });
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting stash item", error, {
        userId: (req.user as AuthenticatedUser)?.claims?.sub,
        itemId: req.params.id,
      });
      res.status(500).json({ message: "Failed to delete stash item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
