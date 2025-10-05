import { ShoppingCart } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary-foreground/10">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold">Smart Grocery Budgeter</h1>
        </div>
      </div>
    </header>
  );
}
