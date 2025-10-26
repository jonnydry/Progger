import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateChordProgression } from "./xaiService";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/generate-progression', async (req, res) => {
    try {
      const { key, mode, includeTensions, numChords, selectedProgression } = req.body;

      // Validate required parameters
      if (!key || !mode || typeof includeTensions !== 'boolean' || !numChords || !selectedProgression) {
        return res.status(400).json({
          error: "Missing required parameters: key, mode, includeTensions, numChords, selectedProgression"
        });
      }

      // Validate numChords is a positive integer
      if (typeof numChords !== 'number' || numChords < 1 || numChords > 12) {
        return res.status(400).json({
          error: "numChords must be a number between 1 and 12"
        });
      }

      const result = await generateChordProgression(
        key,
        mode,
        includeTensions,
        numChords,
        selectedProgression
      );

      res.json(result);
    } catch (error) {
      console.error("Error in /api/generate-progression:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Stash routes - require authentication
  app.get('/api/stash', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getUserStashItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching stash items:", error);
      res.status(500).json({ message: "Failed to fetch stash items" });
    }
  });

  app.post('/api/stash', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, key, mode, progressionData } = req.body;

      if (!name || !key || !mode || !progressionData) {
        return res.status(400).json({
          error: "Missing required fields: name, key, mode, progressionData"
        });
      }

      const newItem = await storage.createStashItem({
        userId,
        name,
        key,
        mode,
        progressionData,
      });

      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating stash item:", error);
      res.status(500).json({ message: "Failed to create stash item" });
    }
  });

  app.delete('/api/stash/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;

      await storage.deleteStashItem(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting stash item:", error);
      res.status(500).json({ message: "Failed to delete stash item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
