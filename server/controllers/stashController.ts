import type { Request, Response } from "express";
import { storage } from "../storage";
import type { AuthenticatedUser } from "../replitAuth";
import { logger } from "../utils/logger";

export async function handleGetStash(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as AuthenticatedUser;
    const userId = user.claims.sub;

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

    if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
      res.status(400).json({ message: "Invalid limit parameter. Must be between 1 and 100." });
      return;
    }
    if (offset !== undefined && (isNaN(offset) || offset < 0)) {
      res.status(400).json({ message: "Invalid offset parameter. Must be 0 or greater." });
      return;
    }
    if (offset !== undefined && offset > 0 && (limit === undefined || limit <= 0)) {
      res.status(400).json({ message: "Offset requires a valid limit parameter to be specified." });
      return;
    }

    const items = await storage.getUserStashItems(userId, limit, offset);
    logger.debug("Fetched stash items", {
      requestId: req.id,
      userId,
      itemCount: items.length,
      limit,
      offset,
    });
    res.set("Cache-Control", "private, max-age=60, must-revalidate");
    res.json(items);
  } catch (error) {
    logger.error("Error fetching stash items", error, {
      requestId: req.id,
      userId: (req.user as AuthenticatedUser)?.claims?.sub,
    });
    res.status(500).json({ message: "Failed to fetch stash items" });
  }
}

export async function handleCreateStashItem(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as AuthenticatedUser;
    const userId = user.claims.sub;
    const { name, key, mode, progressionData } = req.body;

    const newItem = await storage.createStashItem({
      userId,
      name,
      key,
      mode,
      progressionData,
    });

    logger.info("Stash item created", { requestId: req.id, userId, itemId: newItem.id, name });
    res.set("Cache-Control", "no-cache");
    res.status(201).json(newItem);
  } catch (error) {
    logger.error("Error creating stash item", error, {
      requestId: req.id,
      userId: (req.user as AuthenticatedUser)?.claims?.sub,
      body: req.body,
    });
    res.status(500).json({ message: "Failed to create stash item" });
  }
}

export async function handleDeleteStashItem(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as AuthenticatedUser;
    const userId = user.claims.sub;
    const { id } = req.params;

    await storage.deleteStashItem(id, userId);
    logger.info("Stash item deleted", { requestId: req.id, userId, itemId: id });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found or unauthorized")) {
      logger.warn("Stash item not found or unauthorized", {
        requestId: req.id,
        userId: (req.user as AuthenticatedUser)?.claims?.sub,
        itemId: req.params.id,
      });
      res.status(404).json({ message: "Stash item not found" });
      return;
    }
    logger.error("Error deleting stash item", error, {
      requestId: req.id,
      userId: (req.user as AuthenticatedUser)?.claims?.sub,
      itemId: req.params.id,
    });
    res.status(500).json({ message: "Failed to delete stash item" });
  }
}
