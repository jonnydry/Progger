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

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserStashItems(userId: string): Promise<StashItem[]>;
  createStashItem(item: InsertStashItem): Promise<StashItem>;
  deleteStashItem(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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
  }

  async getUserStashItems(userId: string): Promise<StashItem[]> {
    const items = await db
      .select()
      .from(stash)
      .where(eq(stash.userId, userId))
      .orderBy(desc(stash.createdAt));
    return items;
  }

  async createStashItem(item: InsertStashItem): Promise<StashItem> {
    const [newItem] = await db
      .insert(stash)
      .values(item)
      .returning();
    return newItem;
  }

  async deleteStashItem(id: string, userId: string): Promise<void> {
    await db
      .delete(stash)
      .where(and(eq(stash.id, id), eq(stash.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
