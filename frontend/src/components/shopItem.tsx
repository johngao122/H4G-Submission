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
    onAddToCart,
}) => {
    const [quantity, setQuantity] = React.useState("1");

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
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4">
                <Select value={quantity} onValueChange={setQuantity}>
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder="Quantity" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                                {num}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    onClick={() => onAddToCart(id, parseInt(quantity))}
                    className="ml-4"
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ShopItem;
