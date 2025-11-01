import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    price?: number;
    checked: boolean;
}

export function SimpleShoppingList() {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItem, setNewItem] = useState("");
    const [budget, setBudget] = useState("");
    const [editingPrice, setEditingPrice] = useState<string | null>(null);
    const [tempPrice, setTempPrice] = useState("");
    const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
    const [tempQuantity, setTempQuantity] = useState("");

    // Common grocery items for auto-suggestions
    const commonItems = [
        "milk", "bread", "eggs", "butter", "cheese", "chicken", "beef", "fish",
        "rice", "pasta", "potatoes", "onions", "tomatoes", "bananas", "apples",
        "lettuce", "carrots", "broccoli", "cereal", "yogurt", "juice", "coffee",
        "tea", "sugar", "flour", "oil", "salt", "pepper", "garlic", "lemon"
    ];

    // Load data from localStorage on mount
    useEffect(() => {
        try {
            const savedItems = localStorage.getItem('shoppingListItems');
            const savedBudget = localStorage.getItem('shoppingListBudget');
            
            if (savedItems) {
                setItems(JSON.parse(savedItems));
            }
            if (savedBudget) {
                setBudget(savedBudget);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }, []);

    // Save items to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('shoppingListItems', JSON.stringify(items));
        } catch (error) {
            console.error('Error saving items to localStorage:', error);
        }
    }, [items]);

    // Save budget to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('shoppingListBudget', budget);
        } catch (error) {
            console.error('Error saving budget to localStorage:', error);
        }
    }, [budget]);

    const addItem = () => {
        if (newItem.trim()) {
            const item: ShoppingItem = {
                id: Date.now().toString(),
                name: newItem.trim(),
                quantity: 1,
                checked: false,
            };
            setItems([...items, item]);
            setNewItem("");
        }
    };

    const toggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const deleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const startEditingPrice = (id: string, currentPrice?: number) => {
        setEditingPrice(id);
        setTempPrice(currentPrice?.toString() || "");
    };

    const savePrice = (id: string) => {
        const price = parseFloat(tempPrice);
        if (!isNaN(price) && price >= 0) {
            setItems(items.map(item =>
                item.id === id ? { ...item, price } : item
            ));
        }
        setEditingPrice(null);
        setTempPrice("");
    };

    const cancelEditingPrice = () => {
        setEditingPrice(null);
        setTempPrice("");
    };

    const startEditingQuantity = (id: string, currentQuantity: number) => {
        setEditingQuantity(id);
        setTempQuantity(currentQuantity.toString());
    };

    const saveQuantity = (id: string) => {
        const quantity = parseInt(tempQuantity);
        if (!isNaN(quantity) && quantity > 0) {
            setItems(items.map(item =>
                item.id === id ? { ...item, quantity } : item
            ));
        }
        setEditingQuantity(null);
        setTempQuantity("");
    };

    const cancelEditingQuantity = () => {
        setEditingQuantity(null);
        setTempQuantity("");
    };

    const getTotalSpent = () => {
        return items
            .filter(item => item.checked && item.price)
            .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    };

    const getBudgetStatus = () => {
        const budgetNum = parseFloat(budget);
        const spent = getTotalSpent();

        if (!budget || isNaN(budgetNum)) return null;

        if (spent <= budgetNum) {
            return { status: "under", remaining: budgetNum - spent };
        } else {
            return { status: "over", overage: spent - budgetNum };
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            addItem();
        }
    };

    const filteredItems = items.filter(item =>
        commonItems.some(common =>
            item.name.toLowerCase().includes(common.toLowerCase())
        )
    );

    const budgetStatus = getBudgetStatus();

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Budget Input */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Budget (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            type="number"
                            placeholder="Enter budget amount (e.g., 100)"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="flex-1 text-base h-12"
                        />
                        {budgetStatus && (
                            <Badge
                                variant={budgetStatus.status === "under" ? "default" : "destructive"}
                                className="px-3 py-2 text-sm self-center sm:self-auto"
                            >
                                {budgetStatus.status === "under"
                                    ? `$${budgetStatus.remaining.toFixed(2)} left`
                                    : `$${budgetStatus.overage.toFixed(2)} over`
                                }
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add Item */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Add Items</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type what you need (e.g., milk, bread, eggs)"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 text-base h-12"
                        />
                        <Button onClick={addItem} disabled={!newItem.trim()} className="h-12 px-4">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Auto-suggestions */}
                    {newItem.length > 1 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {commonItems
                                .filter(item =>
                                    item.toLowerCase().includes(newItem.toLowerCase()) &&
                                    !items.some(existing =>
                                        existing.name.toLowerCase() === item.toLowerCase()
                                    )
                                )
                                .slice(0, 5)
                                .map(item => (
                                    <Button
                                        key={item}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setNewItem(item);
                                            addItem();
                                        }}
                                        className="text-sm h-9 px-3"
                                    >
                                        {item}
                                    </Button>
                                ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Shopping List */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2 flex-wrap">
                        Shopping List
                        {items.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {items.filter(item => item.checked).length} / {items.length} done
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    {items.length === 0 ? (
                        <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">
                            Your shopping list is empty. Add some items above!
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border ${item.checked ? "bg-muted/50" : "bg-background"
                                        }`}
                                >
                                    <Checkbox
                                        checked={item.checked}
                                        onCheckedChange={() => toggleItem(item.id)}
                                        className="h-5 w-5"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col gap-2">
                                            <span className={`text-sm sm:text-base font-medium ${item.checked ? "line-through text-muted-foreground" : ""
                                                }`}>
                                                {item.name}
                                            </span>

                                            <div className="flex items-center justify-center gap-2">

                                                {/* Quantity */}
                                                {editingQuantity === item.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <Input
                                                            type="number"
                                                            placeholder="1"
                                                            value={tempQuantity}
                                                            onChange={(e) => setTempQuantity(e.target.value)}
                                                            className="w-14 h-10 text-sm"
                                                            autoFocus
                                                        />
                                                        <Button
                                                            size="sm"
                                                            onClick={() => saveQuantity(item.id)}
                                                            className="h-10 w-10 p-0 bg-green-600 hover:bg-green-700"
                                                        >
                                                            ✓
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={cancelEditingQuantity}
                                                            className="h-10 w-10 p-0"
                                                        >
                                                            ✗
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => startEditingQuantity(item.id, item.quantity)}
                                                        className="h-10 px-3 text-sm font-medium min-w-[60px]"
                                                    >
                                                        Qty: {item.quantity}
                                                    </Button>
                                                )}

                                                {/* Price */}
                                                {editingPrice === item.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={tempPrice}
                                                            onChange={(e) => setTempPrice(e.target.value)}
                                                            className="w-20 h-10 text-sm"
                                                        />
                                                        <Button
                                                            size="sm"
                                                            onClick={() => savePrice(item.id)}
                                                            className="h-10 w-10 p-0 bg-green-600 hover:bg-green-700"
                                                        >
                                                            ✓
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={cancelEditingPrice}
                                                            className="h-10 w-10 p-0"
                                                        >
                                                            ✗
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => startEditingPrice(item.id, item.price)}
                                                        className="h-10 px-3 text-sm font-medium min-w-[80px]"
                                                    >
                                                        {item.price ? `$${item.price.toFixed(2)}` : "Add price"}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteItem(item.id)}
                                        className="h-10 w-10 p-0 flex-shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Summary */}
            {items.length > 0 && (
                <Card>
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Total spent</p>
                                <p className="text-xl sm:text-2xl font-bold">${getTotalSpent().toFixed(2)}</p>
                            </div>
                            {budgetStatus && (
                                <div className="text-left sm:text-right">
                                    <p className="text-xs sm:text-sm text-muted-foreground">Budget status</p>
                                    <p className={`text-base sm:text-lg font-semibold ${budgetStatus.status === "under" ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {budgetStatus.status === "under"
                                            ? `$${budgetStatus.remaining.toFixed(2)} left`
                                            : `$${budgetStatus.overage.toFixed(2)} over`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
