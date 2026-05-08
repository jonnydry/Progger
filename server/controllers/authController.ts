import type { Request, Response } from "express";
import { storage } from "../storage";
import type { AuthenticatedUser } from "../replitAuth";
import { logger } from "../utils/logger";

export async function handleGetUser(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as AuthenticatedUser;
    const userId = user.claims.sub;
    const dbUser = await storage.getUser(userId);
    res.set("Cache-Control", "private, max-age=60, must-revalidate");
    res.json(dbUser);
  } catch (error) {
    logger.error("Error fetching user", error, {
      requestId: req.id,
      userId: (req.user as AuthenticatedUser)?.claims?.sub,
    });
    res.status(500).json({ message: "Failed to fetch user" });
  }
}
