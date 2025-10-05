import { useState } from "react";
import { Header } from "@/components/Header";
import { BudgetForm } from "@/components/BudgetForm";
import { GroceryListDisplay } from "@/components/GroceryListDisplay";
import { SavedLists } from "@/components/SavedLists";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { GroceryList, GroceryItem } from "@shared/schema";

export default function Home() {
  const [currentList, setCurrentList] = useState<{
    items: GroceryItem[];
    totalCost: number;
    budget: number;
    underBudget: boolean;
    swapSuggestion?: string;
    savingsTip?: string;
  } | null>(null);
  const [savedLists, setSavedLists] = useState<GroceryList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateList = async (data: { budget: number; dietaryPrefs: string; householdSize: number }) => {
    setIsLoading(true);
    console.log("Generating grocery list with:", data);

    setTimeout(() => {
      const mockItems: GroceryItem[] = [
        { name: "Chicken Breast", quantity: "2 lb", price: 11.98, category: "protein" },
        { name: "White Rice", quantity: "3 lb", price: 7.47, category: "grains" },
        { name: "Broccoli", quantity: "2 lb", price: 5.98, category: "vegetables" },
        { name: "Eggs", quantity: "1 dozen", price: 4.29, category: "protein" },
        { name: "Bananas", quantity: "3 lb", price: 2.07, category: "fruits" },
        { name: "Milk", quantity: "1 gallon", price: 4.49, category: "dairy" },
      ];

      const totalCost = mockItems.reduce((sum, item) => sum + item.price, 0);
      const underBudget = totalCost <= data.budget;

      setCurrentList({
        items: mockItems,
        totalCost,
        budget: data.budget,
        underBudget,
        swapSuggestion: !underBudget ? "Swap ground beef for black beans to save $4.50" : undefined,
        savingsTip: "Buy rice in bulk to save $3 per pound",
      });

      setIsLoading(false);
      
      toast({
        title: "Grocery list generated!",
        description: `${mockItems.length} items selected for $${totalCost.toFixed(2)}`,
      });
    }, 1500);
  };

  const handleSaveList = () => {
    if (!currentList) return;

    const newList: GroceryList = {
      id: `list-${Date.now()}`,
      userId: "user123",
      budget: currentList.budget,
      dietaryPrefs: "none",
      householdSize: 2,
      items: currentList.items as any,
      totalCost: currentList.totalCost,
      underBudget: currentList.underBudget ? 1 : 0,
      swapSuggestion: currentList.swapSuggestion || null,
      savingsTip: currentList.savingsTip || null,
      createdAt: new Date(),
    };

    setSavedLists([newList, ...savedLists]);
    
    toast({
      title: "List saved!",
      description: "Your grocery list has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Plan Your Grocery Shopping</h2>
            <p className="text-muted-foreground">
              Get AI-powered savings tips and optimize your grocery budget
            </p>
          </div>

          <BudgetForm onSubmit={handleGenerateList} isLoading={isLoading} />

          {currentList && (
            <div className="space-y-4">
              <GroceryListDisplay
                items={currentList.items}
                totalCost={currentList.totalCost}
                budget={currentList.budget}
                underBudget={currentList.underBudget}
                swapSuggestion={currentList.swapSuggestion}
                savingsTip={currentList.savingsTip}
              />
              <Button
                onClick={handleSaveList}
                variant="outline"
                className="w-full"
                data-testid="button-save-list"
              >
                Save This List
              </Button>
            </div>
          )}

          <SavedLists lists={savedLists} onListClick={(list) => console.log("List clicked:", list)} />
        </div>
      </main>
    </div>
  );
}
