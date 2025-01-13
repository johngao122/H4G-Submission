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

    const quantityOptions = React.useMemo(() => {
        const maxQuantity = Math.min(5, quantity); // Change accordingly
        return Array.from({ length: maxQuantity }, (_, i) => i + 1);
    }, [quantity]);

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
                            <span className="text-red-500 font-medium">
                                Out of Stock
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
                    disabled={quantity === 0}
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
                <Button
                    onClick={() => onAddToCart(id, parseInt(selectedQuantity))}
                    className="ml-4"
                    disabled={quantity === 0}
                >
                    {quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ShopItem;
