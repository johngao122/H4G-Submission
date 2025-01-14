"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ShoppingCart, Search } from "lucide-react";
import ShopItem from "./shopItem";
import { useRouter } from "next/navigation";
import { Product } from "@/app/types/shop";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/hooks/use-toast";

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

const Shop: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] =
        useState<Product[]>(SAMPLE_PRODUCTS);
    const { totalItems, addToCart } = useCart();

    useEffect(() => {
        const filtered = SAMPLE_PRODUCTS.filter(
            (product) =>
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery]);

    const handleAddToCart = (productId: string, quantity: number) => {
        const productToAdd = SAMPLE_PRODUCTS.find((p) => p.id === productId);
        if (!productToAdd || productToAdd.quantity === 0) {
            toast({
                title: "Error",
                description: "Product is out of stock",
                variant: "destructive",
            });
            return;
        }

        if (quantity > productToAdd.quantity) {
            toast({
                title: "Error",
                description: "Not enough stock available",
                variant: "destructive",
            });
            return;
        }

        addToCart(productId, quantity, productToAdd);
        toast({
            title: "Success",
            description: `${productToAdd.name} added to cart`,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    onClick={() => router.push("/resident/dashboard/shop/cart")}
                    className="ml-4 relative"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <ShopItem
                        key={product.id}
                        {...product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </div>
    );
};

export default Shop;
