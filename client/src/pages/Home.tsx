import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { BudgetForm } from "@/components/BudgetForm";
import { GroceryListDisplay } from "@/components/GroceryListDisplay";
import { SavedLists } from "@/components/SavedLists";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { GroceryList, GroceryItem, BudgetRequest, BudgetResponse } from "@shared/schema";

const USER_ID = "user123";

export default function Home() {
  const [currentList, setCurrentList] = useState<{
    items: GroceryItem[];
    totalCost: number;
    budget: number;
    dietaryPrefs: string;
    householdSize: number;
    underBudget: boolean;
    swapSuggestion?: string;
    savingsTip?: string;
  } | null>(null);
  
  const { toast } = useToast();

  const { data: savedLists = [] } = useQuery<GroceryList[]>({
    queryKey: ["/api/user", USER_ID],
  });

  const generateListMutation = useMutation({
    mutationFn: async (data: BudgetRequest) => {
      const res = await apiRequest("POST", "/api/budget", data);
      return await res.json() as BudgetResponse;
    },
    onSuccess: (response, variables) => {
      setCurrentList({
        items: response.items,
        totalCost: response.totalCost,
        budget: variables.budget,
        dietaryPrefs: variables.dietaryPrefs,
        householdSize: variables.householdSize,
        underBudget: response.underBudget,
        swapSuggestion: response.swapSuggestion,
        savingsTip: response.savingsTip,
      });

      toast({
        title: "Grocery list generated!",
        description: `${response.items.length} items selected for $${response.totalCost.toFixed(2)}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error generating list",
        description: error.message || "Failed to generate grocery list. Using fallback data.",
        variant: "destructive",
      });
    },
  });

  const saveListMutation = useMutation({
    mutationFn: async (listData: any) => {
      const res = await apiRequest("POST", "/api/save-list", listData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user", USER_ID] });
      toast({
        title: "List saved!",
        description: "Your grocery list has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error saving list",
        description: "Failed to save your grocery list.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateList = (data: BudgetRequest) => {
    generateListMutation.mutate(data);
  };

  const handleSaveList = () => {
    if (!currentList) return;

    saveListMutation.mutate({
      userId: USER_ID,
      budget: currentList.budget,
      dietaryPrefs: currentList.dietaryPrefs,
      householdSize: currentList.householdSize,
      items: currentList.items,
      totalCost: currentList.totalCost,
      underBudget: currentList.underBudget,
      swapSuggestion: currentList.swapSuggestion,
      savingsTip: currentList.savingsTip,
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

          <BudgetForm 
            onSubmit={handleGenerateList} 
            isLoading={generateListMutation.isPending} 
          />

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
                disabled={saveListMutation.isPending}
                data-testid="button-save-list"
              >
                {saveListMutation.isPending ? "Saving..." : "Save This List"}
              </Button>
            </div>
          )}

          <SavedLists 
            lists={savedLists} 
            onListClick={(list) => console.log("List clicked:", list)} 
          />
        </div>
      </main>
    </div>
  );
}
