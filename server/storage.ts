import {
  users,
  stash,
  type User,
  type UpsertUser,
  type StashItem,
  type InsertStashItem,
} from "../shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { logger } from "./utils/logger";

// In-memory cache for frequently accessed user data (short TTL).
const userCache = new Map<string, { user: User; expires: number }>();
const USER_CACHE_TTL = 60 * 1000;
const USER_CACHE_MAX_SIZE = 1000;

function setUserCache(id: string, user: User): void {
  if (userCache.has(id)) {
    userCache.delete(id);
  } else if (userCache.size >= USER_CACHE_MAX_SIZE) {
    const oldestKey = userCache.keys().next().value;
    if (oldestKey !== undefined) {
      userCache.delete(oldestKey);
    }
  }
  userCache.set(id, { user, expires: Date.now() + USER_CACHE_TTL });
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserStashItems(userId: string, limit?: number, offset?: number): Promise<StashItem[]>;
  createStashItem(item: InsertStashItem): Promise<StashItem>;
  deleteStashItem(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const cached = userCache.get(id);
      if (cached && cached.expires > Date.now()) {
        logger.debug("User cache hit", { userId: id });
        return cached.user;
      }

      const [user] = await db.select().from(users).where(eq(users.id, id));

      if (user) {
        setUserCache(id, user);
      }

      return user;
    } catch (error) {
      logger.error("Error fetching user from database", error, { userId: id });
      throw new Error("Failed to fetch user from database");
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();

      userCache.delete(user.id);
      return user;
    } catch (error) {
      logger.error(
        "Error upserting user in database",
        error instanceof Error ? error.message : String(error),
        {
          userId: userData.id,
        }
      );
      throw new Error("Failed to upsert user in database");
    }
  }

  async getUserStashItems(userId: string, limit?: number, offset?: number): Promise<StashItem[]> {
    try {
      if (offset !== undefined && offset > 0 && (limit === undefined || limit <= 0)) {
        throw new Error("Offset requires a valid limit to be specified");
      }

      let query = db
        .select()
        .from(stash)
        .where(eq(stash.userId, userId))
        .orderBy(desc(stash.createdAt));

      if (limit !== undefined && limit > 0) {
        query = query.limit(limit) as any;

        if (offset !== undefined && offset > 0) {
          query = query.offset(offset) as any;
        }
      }

      const items = await query;
      return items;
    } catch (error) {
      logger.error("Error fetching stash items from database", error, { userId, limit, offset });
      throw error instanceof Error ? error : new Error("Failed to fetch stash items from database");
    }
  }

  async createStashItem(item: InsertStashItem): Promise<StashItem> {
    try {
      const [newItem] = await db.insert(stash).values(item).returning();
      return newItem;
    } catch (error) {
      logger.error(
        "Error creating stash item in database",
        error instanceof Error ? error.message : String(error),
        {
          userId: item.userId,
        }
      );
      throw new Error("Failed to create stash item in database");
    }
  }

  async deleteStashItem(id: string, userId: string): Promise<void> {
    try {
      const result = await db
        .delete(stash)
        .where(and(eq(stash.id, id), eq(stash.userId, userId)))
        .returning({ id: stash.id });

      if (result.length === 0) {
        logger.warn("Attempted to delete non-existent or unauthorized stash item", {
          itemId: id,
          userId,
        });
        throw new Error("Stash item not found or unauthorized");
      }

      logger.debug("Stash item deleted successfully", { itemId: id, userId });
    } catch (error) {
      logger.error("Error deleting stash item from database", error, { itemId: id, userId });
      throw error instanceof Error ? error : new Error("Failed to delete stash item from database");
    }
  }
}

export const storage = new DatabaseStorage();
