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
import { CartItem } from "@/app/types/shop";
import { useAuth } from "@clerk/nextjs";

const Cart = () => {
    const { userId } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (!userId) {
            localStorage.removeItem("cart");
            setCartItems([]);
        }
    }, [userId]);

    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            setCartItems(JSON.parse(saved));
        }
    }, []);

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
                                                        //Change Accordingly
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
                                                item.price * item.quantity
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
                        <Button className="w-full mt-4">
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
