import { useState } from "react";
import { Header } from "@/components/Header";
import { SimpleShoppingList } from "@/components/SimpleShoppingList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Simple Shopping List</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Just type what you need, set a budget if you want, and check off items as you shop
            </p>
          </div>
          <SimpleShoppingList />
        </div>
      </main>
    </div>
  );
}
