import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, ShoppingBag, DollarSign } from "lucide-react";
import type { GroceryList, GroceryItem } from "@shared/schema";
import { format } from "date-fns";

interface SavedListsProps {
  lists: GroceryList[];
  onListClick?: (list: GroceryList) => void;
}

export function SavedLists({ lists, onListClick }: SavedListsProps) {
  if (lists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Lists</CardTitle>
          <CardDescription>Your saved grocery lists will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No saved lists yet</p>
            <p className="text-sm mt-1">Generate a grocery list to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Lists</CardTitle>
        <CardDescription>{lists.length} saved grocery lists</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {lists.map((list, index) => {
            const items = list.items as GroceryItem[];
            return (
              <AccordionItem key={list.id} value={list.id} data-testid={`accordion-list-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {list.createdAt ? format(new Date(list.createdAt), "MMM dd, yyyy") : "N/A"}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {items.length} items
                          </Badge>
                          <Badge variant={list.underBudget ? "default" : "destructive"} className="text-xs">
                            ${list.totalCost.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Budget:</span>{" "}
                        <span className="font-medium">${list.budget.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Household:</span>{" "}
                        <span className="font-medium">{list.householdSize} people</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Diet:</span>{" "}
                        <Badge variant="secondary" className="text-xs ml-2">
                          {list.dietaryPrefs}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted px-3 py-2 text-xs font-medium">Items</div>
                      <div className="divide-y">
                        {items.map((item, idx) => (
                          <div key={idx} className="px-3 py-2 flex items-center justify-between text-sm">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {onListClick && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => onListClick(list)}
                        data-testid={`button-view-list-${index}`}
                      >
                        View Full Details
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
