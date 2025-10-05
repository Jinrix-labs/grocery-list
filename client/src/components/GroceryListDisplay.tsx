import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import type { GroceryItem } from "@shared/schema";

interface GroceryListDisplayProps {
  items: GroceryItem[];
  totalCost: number;
  budget: number;
  underBudget: boolean;
  swapSuggestion?: string;
  savingsTip?: string;
}

export function GroceryListDisplay({
  items,
  totalCost,
  budget,
  underBudget,
  swapSuggestion,
  savingsTip,
}: GroceryListDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>Your Grocery List</CardTitle>
            <CardDescription>{items.length} items selected</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Cost</div>
            <div className="text-2xl font-semibold" data-testid="text-total-cost">
              ${totalCost.toFixed(2)}
            </div>
            <Badge
              variant={underBudget ? "default" : "destructive"}
              className="mt-2"
              data-testid="badge-budget-status"
            >
              {underBudget ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Under Budget
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Over Budget
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted px-4 py-3 grid grid-cols-3 gap-4 text-sm font-medium">
            <div>Item</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Price</div>
          </div>
          <div className="divide-y">
            {items.map((item, index) => (
              <div
                key={index}
                className="px-4 py-3 grid grid-cols-3 gap-4 items-center hover-elevate"
                data-testid={`row-grocery-item-${index}`}
              >
                <div className="font-medium">{item.name}</div>
                <div className="text-center text-muted-foreground">{item.quantity}</div>
                <div className="text-right font-semibold">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {swapSuggestion && (
          <Alert className="bg-accent/50 border-accent-foreground/20" data-testid="alert-swap-suggestion">
            <AlertTriangle className="h-4 w-4 text-accent-foreground" />
            <AlertDescription className="text-accent-foreground">
              <strong>Budget Tip:</strong> {swapSuggestion}
            </AlertDescription>
          </Alert>
        )}

        {savingsTip && (
          <Alert className="bg-primary/10 border-primary/20" data-testid="alert-savings-tip">
            <Lightbulb className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              <strong>AI Savings Tip:</strong> {savingsTip}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-muted-foreground">Budget: ${budget.toFixed(2)}</span>
          <span className="text-sm font-medium">
            {underBudget ? (
              <span className="text-chart-2">Saved ${(budget - totalCost).toFixed(2)}</span>
            ) : (
              <span className="text-destructive">Over by ${(totalCost - budget).toFixed(2)}</span>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
