import { SavedLists } from '../SavedLists';
import type { GroceryList } from '@shared/schema';

export default function SavedListsExample() {
  const mockLists: GroceryList[] = [
    {
      id: "1",
      userId: "user123",
      budget: 100,
      dietaryPrefs: "keto",
      householdSize: 2,
      items: [
        { name: "Chicken Breast", quantity: "2 lb", price: 11.98 },
        { name: "Eggs", quantity: "1 dozen", price: 4.29 },
        { name: "Broccoli", quantity: "1 lb", price: 2.99 },
      ],
      totalCost: 19.26,
      underBudget: 1,
      swapSuggestion: null,
      savingsTip: "Buy in bulk to save more",
      createdAt: new Date("2025-10-01"),
    },
    {
      id: "2",
      userId: "user123",
      budget: 75,
      dietaryPrefs: "vegan",
      householdSize: 4,
      items: [
        { name: "Black Beans", quantity: "3 cans", price: 4.47 },
        { name: "Brown Rice", quantity: "2 lb", price: 6.58 },
        { name: "Spinach", quantity: "2 bunches", price: 6.98 },
      ],
      totalCost: 18.03,
      underBudget: 1,
      swapSuggestion: null,
      savingsTip: null,
      createdAt: new Date("2025-09-28"),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <SavedLists
        lists={mockLists}
        onListClick={(list) => console.log('List clicked:', list)}
      />
    </div>
  );
}
