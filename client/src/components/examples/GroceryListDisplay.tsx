import { GroceryListDisplay } from '../GroceryListDisplay';

export default function GroceryListDisplayExample() {
  const mockItems = [
    { name: "Chicken Breast", quantity: "2 lb", price: 11.98, category: "protein" },
    { name: "White Rice", quantity: "3 lb", price: 7.47, category: "grains" },
    { name: "Broccoli", quantity: "2 lb", price: 5.98, category: "vegetables" },
    { name: "Eggs", quantity: "1 dozen", price: 4.29, category: "protein" },
    { name: "Bananas", quantity: "3 lb", price: 2.07, category: "fruits" },
    { name: "Milk", quantity: "1 gallon", price: 4.49, category: "dairy" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <GroceryListDisplay
        items={mockItems}
        totalCost={36.28}
        budget={50.00}
        underBudget={true}
        swapSuggestion="Swap ground beef for black beans to save $4.50"
        savingsTip="Buy rice in bulk to save $3 per pound"
      />
    </div>
  );
}
