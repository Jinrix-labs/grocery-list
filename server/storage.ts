import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { groceryLists, apiCallLimits, type GroceryList, type InsertGroceryList, type ApiCallLimit } from "@shared/schema";
import { eq } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

// Temporary in-memory storage for testing without database
let inMemoryLists: GroceryList[] = [];
let inMemoryApiCalls: Record<string, number> = {};

// Only initialize database if DATABASE_URL is provided
let db: any = null;
if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool);
}

export interface IStorage {
  saveGroceryList(list: InsertGroceryList): Promise<GroceryList>;
  getUserLists(userId: string): Promise<GroceryList[]>;
  getApiCallCount(date: string): Promise<number>;
  incrementApiCallCount(date: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async saveGroceryList(list: InsertGroceryList): Promise<GroceryList> {
    if (db) {
      const [savedList] = await db.insert(groceryLists).values(list).returning();
      return savedList;
    } else {
      // In-memory fallback
      const savedList: GroceryList = {
        id: `temp_${Date.now()}`,
        ...list,
        swapSuggestion: list.swapSuggestion || null,
        savingsTip: list.savingsTip || null,
        createdAt: new Date(),
      };
      inMemoryLists.push(savedList);
      return savedList;
    }
  }

  async getUserLists(userId: string): Promise<GroceryList[]> {
    if (db) {
      const lists = await db
        .select()
        .from(groceryLists)
        .where(eq(groceryLists.userId, userId))
        .orderBy(groceryLists.createdAt);
      return lists;
    } else {
      // In-memory fallback
      return inMemoryLists.filter(list => list.userId === userId);
    }
  }

  async getApiCallCount(date: string): Promise<number> {
    if (db) {
      const [result] = await db
        .select()
        .from(apiCallLimits)
        .where(eq(apiCallLimits.date, date));
      return result?.callCount || 0;
    } else {
      // In-memory fallback
      return inMemoryApiCalls[date] || 0;
    }
  }

  async incrementApiCallCount(date: string): Promise<void> {
    if (db) {
      const [existing] = await db
        .select()
        .from(apiCallLimits)
        .where(eq(apiCallLimits.date, date));

      if (existing) {
        await db
          .update(apiCallLimits)
          .set({ callCount: existing.callCount + 1 })
          .where(eq(apiCallLimits.date, date));
      } else {
        await db.insert(apiCallLimits).values({ date, callCount: 1 });
      }
    } else {
      // In-memory fallback
      inMemoryApiCalls[date] = (inMemoryApiCalls[date] || 0) + 1;
    }
  }
}

export const storage = new DbStorage();
