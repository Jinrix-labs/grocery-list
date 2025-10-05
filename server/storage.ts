import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { groceryLists, apiCallLimits, type GroceryList, type InsertGroceryList, type ApiCallLimit } from "@shared/schema";
import { eq } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

export interface IStorage {
  saveGroceryList(list: InsertGroceryList): Promise<GroceryList>;
  getUserLists(userId: string): Promise<GroceryList[]>;
  getApiCallCount(date: string): Promise<number>;
  incrementApiCallCount(date: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async saveGroceryList(list: InsertGroceryList): Promise<GroceryList> {
    const [savedList] = await db.insert(groceryLists).values(list).returning();
    return savedList;
  }

  async getUserLists(userId: string): Promise<GroceryList[]> {
    const lists = await db
      .select()
      .from(groceryLists)
      .where(eq(groceryLists.userId, userId))
      .orderBy(groceryLists.createdAt);
    return lists;
  }

  async getApiCallCount(date: string): Promise<number> {
    const [result] = await db
      .select()
      .from(apiCallLimits)
      .where(eq(apiCallLimits.date, date));
    return result?.callCount || 0;
  }

  async incrementApiCallCount(date: string): Promise<void> {
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
  }
}

export const storage = new DbStorage();
