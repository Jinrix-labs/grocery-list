import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import axios from "axios";
import { readFileSync } from "fs";
import { join } from "path";
import type { GroceryItem, BudgetRequest, BudgetResponse } from "@shared/schema";

const budgetRequestSchema = z.object({
  budget: z.number().min(1),
  dietaryPrefs: z.string(),
  householdSize: z.number().min(1).max(10),
});

const DAILY_API_LIMIT = 150;
const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID || "placeholder_app_id";
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY || "placeholder_app_key";

let fallbackData: any = null;

function loadFallbackData() {
  if (!fallbackData) {
    try {
      const data = readFileSync(join(process.cwd(), "groceries.json"), "utf-8");
      fallbackData = JSON.parse(data);
      console.log("✓ Loaded fallback grocery data");
    } catch (error) {
      console.error("Failed to load groceries.json:", error);
      fallbackData = { groceries: [] };
    }
  }
  return fallbackData;
}

function generateGroceryListFromFallback(
  budget: number,
  dietaryPrefs: string,
  householdSize: number
): GroceryItem[] {
  const data = loadFallbackData();
  let availableItems = [...data.groceries];

  if (dietaryPrefs === "vegan") {
    availableItems = availableItems.filter(
      (item: any) => !["protein", "dairy"].includes(item.category) || item.name.toLowerCase().includes("bean")
    );
  } else if (dietaryPrefs === "keto") {
    availableItems = availableItems.filter(
      (item: any) => !["grains", "fruits"].includes(item.category)
    );
  }

  availableItems.sort((a: any, b: any) => a.price - b.price);

  const items: GroceryItem[] = [];
  let remainingBudget = budget;
  const baseMultiplier = Math.max(1, householdSize / 2);

  for (const item of availableItems) {
    if (items.length >= 10) break;

    const quantity = Math.ceil(baseMultiplier * (Math.random() * 1.5 + 0.5));
    const totalPrice = item.price * quantity;

    if (totalPrice <= remainingBudget * 0.2) {
      items.push({
        name: item.name,
        quantity: `${quantity} ${item.unit}`,
        price: parseFloat(totalPrice.toFixed(2)),
        category: item.category,
      });
      remainingBudget -= totalPrice;
    }
  }

  return items;
}

function generateSwapSuggestion(
  items: GroceryItem[],
  totalCost: number,
  budget: number
): string | undefined {
  if (totalCost <= budget) return undefined;

  const overage = totalCost - budget;
  const expensiveItems = items
    .filter((item) => item.price > 5)
    .sort((a, b) => b.price - a.price);

  if (expensiveItems.length > 0) {
    const expensive = expensiveItems[0];
    const savings = Math.min(expensive.price * 0.4, overage);
    
    const swaps: Record<string, string> = {
      "Salmon Fillet": "canned tuna",
      "Ground Beef": "black beans",
      "Chicken Breast": "eggs",
      "Cheddar Cheese": "Greek yogurt",
    };

    const swapTo = swaps[expensive.name] || "a cheaper alternative";
    return `Swap ${expensive.name} for ${swapTo} to save $${savings.toFixed(2)}`;
  }

  return "Consider buying store brands to reduce costs";
}

function generateSavingsTip(items: GroceryItem[], budget: number, totalCost: number): string {
  const categories = items.reduce((acc, item) => {
    const cat = item.category || "other";
    acc[cat] = (acc[cat] || 0) + item.price;
    return acc;
  }, {} as Record<string, number>);

  const snacksAndExtras = (categories["snacks"] || 0) + (categories["pantry"] || 0);
  if (snacksAndExtras > totalCost * 0.2) {
    return "Reduce snack purchases to save up to $10 on your grocery bill";
  }

  const bulkItems = items.filter((item) => 
    item.name.toLowerCase().includes("rice") || 
    item.name.toLowerCase().includes("beans") ||
    item.name.toLowerCase().includes("pasta")
  );
  
  if (bulkItems.length > 0) {
    return `Buy ${bulkItems[0].name} in bulk to save $3-5 per pound`;
  }

  const hasExpensiveProtein = items.some((item) => 
    item.category === "protein" && item.price > 10
  );
  
  if (hasExpensiveProtein) {
    return "Consider meal prepping to reduce food waste and save 20-30% on groceries";
  }

  if (totalCost / budget > 0.9) {
    return "Shop with a list and avoid impulse purchases to stay within budget";
  }

  return "Plan meals around sales and seasonal produce for maximum savings";
}

async function fetchFromEdamamAPI(
  budget: number,
  dietaryPrefs: string,
  householdSize: number,
  today: string
): Promise<GroceryItem[] | null> {
  try {
    console.log("→ Attempting to fetch from Edamam API...");
    
    await storage.incrementApiCallCount(today);
    
    const searchTerms = ["chicken", "rice", "eggs", "beans", "broccoli", "milk"];
    const items: GroceryItem[] = [];
    const baseMultiplier = Math.max(1, householdSize / 2);

    for (const term of searchTerms) {
      if (items.length >= 8) break;

      try {
        const response = await axios.get(
          `https://api.edamam.com/api/food-database/v2/parser`,
          {
            params: {
              app_id: EDAMAM_APP_ID,
              app_key: EDAMAM_APP_KEY,
              ingr: term,
              "nutrition-type": "logging",
            },
            timeout: 3000,
          }
        );

        if (response.data?.hints && response.data.hints.length > 0) {
          const foodItem = response.data.hints[0].food;
          const estimatedPrice = Math.random() * 8 + 2;
          const quantity = Math.ceil(baseMultiplier * (Math.random() * 1.5 + 0.5));
          
          items.push({
            name: foodItem.label || term,
            quantity: `${quantity} lb`,
            price: parseFloat((estimatedPrice * quantity).toFixed(2)),
            category: foodItem.category?.toLowerCase() || "general",
          });
        }
      } catch (err) {
        console.log(`✗ Failed to fetch ${term} from Edamam`);
        continue;
      }
    }

    if (items.length > 0) {
      console.log(`✓ Edamam API returned ${items.length} items`);
      return items;
    }

    return null;
  } catch (error: any) {
    console.log("✗ Edamam API failed:", error.message);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/budget", async (req, res) => {
    try {
      const data = budgetRequestSchema.parse(req.body);
      console.log(`\n📊 Budget request: $${data.budget}, ${data.dietaryPrefs}, ${data.householdSize} people`);

      const today = new Date().toISOString().split("T")[0];
      const currentCallCount = await storage.getApiCallCount(today);

      let items: GroceryItem[] | null = null;
      let usedFallback = false;

      if (currentCallCount < DAILY_API_LIMIT) {
        items = await fetchFromEdamamAPI(data.budget, data.dietaryPrefs, data.householdSize, today);
        
        if (items) {
          console.log(`✓ API call successful (${currentCallCount + 1}/${DAILY_API_LIMIT})`);
        }
      } else {
        console.log(`⚠ API limit reached (${currentCallCount}/${DAILY_API_LIMIT}), using fallback`);
        usedFallback = true;
      }

      if (!items) {
        console.log("→ Using fallback data from groceries.json");
        items = generateGroceryListFromFallback(data.budget, data.dietaryPrefs, data.householdSize);
        usedFallback = true;
      }

      const totalCost = items.reduce((sum, item) => sum + item.price, 0);
      const underBudget = totalCost <= data.budget;

      const swapSuggestion = generateSwapSuggestion(items, totalCost, data.budget);
      const savingsTip = generateSavingsTip(items, data.budget, totalCost);

      const response: BudgetResponse = {
        items,
        totalCost: parseFloat(totalCost.toFixed(2)),
        underBudget,
        swapSuggestion,
        savingsTip,
      };

      console.log(`✓ Generated list: ${items.length} items, $${totalCost.toFixed(2)} (${underBudget ? 'under' : 'over'} budget)`);
      if (usedFallback) {
        console.log("ℹ Using fallback data");
      }

      res.json(response);
    } catch (error: any) {
      console.error("Error in /api/budget:", error);
      res.status(400).json({ 
        message: error.message || "Failed to generate grocery list",
      });
    }
  });

  app.post("/api/save-list", async (req, res) => {
    try {
      const { userId, budget, dietaryPrefs, householdSize, items, totalCost, underBudget, swapSuggestion, savingsTip } = req.body;

      if (!userId || !items || items.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const savedList = await storage.saveGroceryList({
        userId,
        budget,
        dietaryPrefs,
        householdSize,
        items,
        totalCost,
        underBudget: underBudget ? 1 : 0,
        swapSuggestion: swapSuggestion || null,
        savingsTip: savingsTip || null,
      });

      console.log(`✓ Saved grocery list for user ${userId}`);
      res.json({ success: true, listId: savedList.id });
    } catch (error: any) {
      console.error("Error in /api/save-list:", error);
      res.status(500).json({ message: "Failed to save grocery list" });
    }
  });

  app.get("/api/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const lists = await storage.getUserLists(userId);

      console.log(`✓ Retrieved ${lists.length} lists for user ${userId}`);
      res.json(lists);
    } catch (error: any) {
      console.error("Error in /api/user/:userId:", error);
      res.status(500).json({ message: "Failed to retrieve grocery lists" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
