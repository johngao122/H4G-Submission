"use client";

import React, { useState } from "react";
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
import { Product } from "@/app/types/shop";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cartContext";

const SAMPLE_PRODUCTS: Product[] = [
    //remove when API is out
    {
        id: "1",
        name: "Product 1",
        description: "Description of Product 1",
        price: 19.99,
        imageUrl: "/api/placeholder/300/200",
        quantity: 200,
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
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const { toast } = useToast();
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

    const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        const product = SAMPLE_PRODUCTS.find((p) => p.id === productId);

        if (product && newQuantity > product.quantity) {
            toast({
                title: "Error",
                description: "Not enough stock available",
                variant: "destructive",
            });
            return;
        }

        updateQuantity(productId, newQuantity);
    };

    const handleCheckout = async () => {
        if (!userId || cartItems.length === 0) return;

        setIsCheckingOut(true);
        try {
            const outOfStockItems = cartItems.filter((cartItem) => {
                const shopItem = SAMPLE_PRODUCTS.find(
                    //replace with API
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

            // TODO: Replace with actual API call
            console.log("Processing transaction:", transaction);

            clearCart();

            toast({
                title: "Purchase Successful",
                description: "Your order has been processed successfully",
            });
        } catch (error) {
            console.error("Checkout error:", error);
            toast({
                title: "Checkout Failed",
                description:
                    "There was an error processing your checkout. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsCheckingOut(false);
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
                                                    handleQuantityChange(
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
                                                    handleQuantityChange(
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
                                                    handleQuantityChange(
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
