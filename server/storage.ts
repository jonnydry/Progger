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

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserStashItems(userId: string): Promise<StashItem[]>;
  createStashItem(item: InsertStashItem): Promise<StashItem>;
  deleteStashItem(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      logger.error("Error fetching user from database", error, { userId: id });
      throw new Error('Failed to fetch user from database');
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
      return user;
    } catch (error) {
      logger.error("Error upserting user in database", error, { userId: userData.id });
      throw new Error('Failed to upsert user in database');
    }
  }

  async getUserStashItems(userId: string): Promise<StashItem[]> {
    try {
      const items = await db
        .select()
        .from(stash)
        .where(eq(stash.userId, userId))
        .orderBy(desc(stash.createdAt));
      return items;
    } catch (error) {
      logger.error("Error fetching stash items from database", error, { userId });
      throw new Error('Failed to fetch stash items from database');
    }
  }

  async createStashItem(item: InsertStashItem): Promise<StashItem> {
    try {
      const [newItem] = await db
        .insert(stash)
        .values(item)
        .returning();
      return newItem;
    } catch (error) {
      logger.error("Error creating stash item in database", error, { userId: item.userId });
      throw new Error('Failed to create stash item in database');
    }
  }

  async deleteStashItem(id: string, userId: string): Promise<void> {
    try {
      await db
        .delete(stash)
        .where(and(eq(stash.id, id), eq(stash.userId, userId)));
    } catch (error) {
      logger.error("Error deleting stash item from database", error, { itemId: id, userId });
      throw new Error('Failed to delete stash item from database');
    }
  }
}

export const storage = new DatabaseStorage();
