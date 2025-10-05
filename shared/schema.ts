import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const groceryLists = pgTable("grocery_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  budget: real("budget").notNull(),
  dietaryPrefs: text("dietary_prefs").notNull(),
  householdSize: integer("household_size").notNull(),
  items: jsonb("items").notNull(),
  totalCost: real("total_cost").notNull(),
  underBudget: integer("under_budget").notNull(),
  swapSuggestion: text("swap_suggestion"),
  savingsTip: text("savings_tip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apiCallLimits = pgTable("api_call_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull().unique(),
  callCount: integer("call_count").notNull().default(0),
});

export const insertGroceryListSchema = createInsertSchema(groceryLists).omit({
  id: true,
  createdAt: true,
});

export const insertApiCallLimitSchema = createInsertSchema(apiCallLimits).omit({
  id: true,
});

export type InsertGroceryList = z.infer<typeof insertGroceryListSchema>;
export type GroceryList = typeof groceryLists.$inferSelect;
export type ApiCallLimit = typeof apiCallLimits.$inferSelect;

export interface GroceryItem {
  name: string;
  quantity: string;
  price: number;
  category?: string;
}

export interface BudgetRequest {
  budget: number;
  dietaryPrefs: string;
  householdSize: number;
}

export interface BudgetResponse {
  items: GroceryItem[];
  totalCost: number;
  underBudget: boolean;
  swapSuggestion?: string;
  savingsTip?: string;
}
