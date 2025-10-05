import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Loader2 } from "lucide-react";

interface BudgetFormProps {
  onSubmit: (data: { budget: number; dietaryPrefs: string; householdSize: number }) => void;
  isLoading?: boolean;
}

export function BudgetForm({ onSubmit, isLoading = false }: BudgetFormProps) {
  const [budget, setBudget] = useState("100");
  const [dietaryPrefs, setDietaryPrefs] = useState("none");
  const [householdSize, setHouseholdSize] = useState("2");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      budget: parseFloat(budget),
      dietaryPrefs,
      householdSize: parseInt(householdSize),
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Create Your Grocery Budget</CardTitle>
            <CardDescription>Enter your budget and preferences to get started</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              min="1"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="100.00"
              required
              data-testid="input-budget"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary-prefs">Dietary Preferences</Label>
            <Select value={dietaryPrefs} onValueChange={setDietaryPrefs}>
              <SelectTrigger id="dietary-prefs" data-testid="select-dietary-prefs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Preference</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="household-size">Household Size</Label>
            <Input
              id="household-size"
              type="number"
              min="1"
              max="10"
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              placeholder="2"
              required
              data-testid="input-household-size"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-generate-list">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating List...
              </>
            ) : (
              "Generate Grocery List"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
