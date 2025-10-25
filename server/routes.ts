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

  const httpServer = createServer(app);
  return httpServer;
}
