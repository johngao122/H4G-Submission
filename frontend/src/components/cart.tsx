"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { CartItem, Product } from "@/app/types/shop";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_PRODUCTS: Product[] = [
    //remove when API is out
    {
        id: "1",
        name: "Product 1",
        description: "Description of Product 1",
        price: 19.99,
        imageUrl: "/api/placeholder/300/200",
        quantity: 0,
    },
    {
        id: "2",
        name: "Product 2",
        description: "Description of Product 2",
        price: 29.99,
        imageUrl: "/api/placeholder/300/200",
        quantity: 100,
    },
    {
        id: "3",
        name: "Product 3",
        description: "Description of Product 3",
        price: 39.99,
        imageUrl: "/api/placeholder/300/200",
        quantity: 0,
    },
];

const Cart = () => {
    const { userId } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCheckingOut, SetIsCheckingOut] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!userId) {
            localStorage.removeItem("cart");
            setCartItems([]);
        }
    }, [userId]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("cart");
            if (saved) {
                try {
                    const parsedCart = JSON.parse(saved);
                    const validCart = parsedCart.every(
                        (item: any) =>
                            item.id &&
                            typeof item.price === "number" &&
                            typeof item.quantity === "number"
                    );
                    if (validCart) {
                        setCartItems(parsedCart);
                    } else {
                        console.error("Invalid cart data detected");
                        localStorage.removeItem("cart");
                    }
                } catch (error) {
                    console.error("Error parsing cart data:", error);
                    localStorage.removeItem("cart");
                }
            }
        }
    }, []);

    if (!isClient) {
        return null;
    }

    const updateCart = (updatedCart: CartItem[]) => {
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeFromCart = (productId: string) => {
        const updatedCart = cartItems.filter((item) => item.id !== productId);
        updateCart(updatedCart);
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
            return;
        }

        const updatedCart = cartItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        updateCart(updatedCart);
    };

    const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (!userId || cartItems.length === 0) return;
        console.log("checkout");

        SetIsCheckingOut(true);
        try {
            // make sure to integrate this with API
            /*
            const shopResponse = await fetch('/api/shop/items');
            if (!shopResponse.ok) {
                throw new Error('Failed to fetch shop items');
            }
                */
            const shopItems: Product[] = SAMPLE_PRODUCTS;

            const outOfStockItems = cartItems.filter((cartItem) => {
                const shopItem = shopItems.find(
                    (item) => item.id === cartItem.id
                );
                return !shopItem || shopItem.quantity < cartItem.quantity;
            });

            if (outOfStockItems.length > 0) {
                const itemNames = outOfStockItems
                    .map((item) => item.name)
                    .join(", ");
                toast({
                    title: "Items Out of Stock",
                    description: `The following items are no longer available in the requested quantity: ${itemNames}`,
                    variant: "destructive",
                });
                return;
            }

            const transaction = {
                userId,
                items: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    pricePerUnit: item.price,
                })),
                totalPrice: totalAmount,
                datetime: new Date().toISOString(),
            };
            console.log(transaction);

            /*
            const transactionResponse = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });
            
            if (!transactionResponse.ok) {
                throw new Error('Failed to create transaction');
            }

            const result = await transactionResponse.json();
            
            // Clear cart and show success message
            localStorage.removeItem("cart");
            setCartItems([]);
            
            toast({
                title: "Purchase Successful",
                description: `Transaction ID: ${result.transactionId}`,
                variant: "default",
            });
            */
        } catch (error) {
            console.error("Checkout error:", error);
            toast({
                title: "Checkout Failed",
                description:
                    "There was an error processing your checkout. Please try again.",
                variant: "destructive",
            });
        } finally {
            SetIsCheckingOut(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="flex items-center p-4">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="ml-4 flex-1">
                                    <h3 className="font-semibold">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        Math.max(
                                                            0,
                                                            item.quantity - 1
                                                        )
                                                    )
                                                }
                                                className="h-8 w-8"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Select
                                                value={item.quantity.toString()}
                                                onValueChange={(value) =>
                                                    updateQuantity(
                                                        item.id,
                                                        parseInt(value)
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-20">
                                                    <SelectValue placeholder="Quantity" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[
                                                        1, 2, 3, 4, 5, 6, 7, 8,
                                                        9, 10,
                                                    ].map((num) => (
                                                        <SelectItem
                                                            key={num}
                                                            value={num.toString()}
                                                        >
                                                            {num}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="h-8 w-8"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="font-medium ml-auto">
                                            $
                                            {(
                                                (item.price || 0) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 ml-4"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total:</span>
                            <span className="text-xl font-bold">
                                ${totalAmount.toFixed(2)}
                            </span>
                        </div>
                        <Button
                            className="w-full mt-4"
                            onClick={handleCheckout}
                            disabled={isCheckingOut || cartItems.length === 0}
                        >
                            {isCheckingOut
                                ? "Processing..."
                                : "Proceed to Checkout"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
