"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import type { ShopItemProps } from "@/app/types/shop";

const ShopItem: React.FC<ShopItemProps> = ({
    id,
    name,
    description,
    price,
    imageUrl,
    quantity,
    onAddToCart,
}) => {
    const [selectedQuantity, setSelectedQuantity] = React.useState("1");
    const [isPreordering, setIsPreordering] = React.useState(false);
    const { userId } = useAuth();
    const { toast } = useToast();

    const quantityOptions = React.useMemo(() => {
        const maxQuantity = Math.min(5, quantity || 5);
        return Array.from({ length: maxQuantity }, (_, i) => i + 1);
    }, [quantity]);

    const handlePreorder = async () => {
        if (!userId) {
            toast({
                title: "Error",
                description: "Please log in to place a pre-order",
                variant: "destructive",
            });
            return;
        }

        setIsPreordering(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/preorders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        productId: id,
                        qtyPreordered: parseInt(selectedQuantity),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to place pre-order");
            }

            toast({
                title: "Success",
                description: `Pre-order placed for ${name}`,
            });
        } catch (error) {
            console.error("Pre-order error:", error);
            toast({
                title: "Error",
                description:
                    "Failed to place pre-order. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsPreordering(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardContent className="p-4">
                <img
                    src={imageUrl || "/api/placeholder/300/200"}
                    alt={name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                    <p className="text-lg font-bold">${price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                        {quantity === 0 ? (
                            <span className="text-orange-500 font-medium">
                                Available for Pre-order
                            </span>
                        ) : (
                            <span>Stock: {quantity}</span>
                        )}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4">
                <Select
                    value={selectedQuantity}
                    onValueChange={setSelectedQuantity}
                >
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder="Quantity" />
                    </SelectTrigger>
                    <SelectContent>
                        {quantityOptions.map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                                {num}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {quantity === 0 ? (
                    <Button
                        onClick={handlePreorder}
                        className="ml-4 bg-orange-500 hover:bg-orange-600"
                        disabled={isPreordering}
                    >
                        {isPreordering ? "Processing..." : "Pre-order"}
                    </Button>
                ) : (
                    <Button
                        onClick={() =>
                            onAddToCart(id, parseInt(selectedQuantity))
                        }
                        className="ml-4"
                    >
                        Add to Cart
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default ShopItem;
