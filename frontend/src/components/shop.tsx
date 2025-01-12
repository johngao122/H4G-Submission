"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ShoppingCart, Search } from "lucide-react";
import ShopItem from "./shopItem";
import { useRouter } from "next/navigation";
import { Product } from "@/app/types/shop";
import { useAuth } from "@clerk/nextjs";

const SAMPLE_PRODUCTS: Product[] = [
    //replace with API
    {
        id: "1",
        name: "Product 1",
        description: "Description of Product 1",
        price: 19.99,
        imageUrl: "/api/placeholder/300/200",
    },
    {
        id: "2",
        name: "Product 2",
        description: "Description of Product 2",
        price: 29.99,
        imageUrl: "/api/placeholder/300/200",
    },
    {
        id: "3",
        name: "Product 3",
        description: "Description of Product 3",
        price: 39.99,
        imageUrl: "/api/placeholder/300/200",
    },
];

const Shop: React.FC = () => {
    const router = useRouter();
    const { userId } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] =
        useState<Product[]>(SAMPLE_PRODUCTS);
    const [cartItems, setCartItems] = useState<
        { id: string; quantity: number }[]
    >(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("cart");
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (!userId) {
            localStorage.removeItem("cart");
            setCartItems([]);
        }
    }, [userId]);

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
        if (!productToAdd) return;

        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === productId
            );

            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity:
                        updatedItems[existingItemIndex].quantity + quantity,
                };
                return updatedItems;
            } else {
                return [...prevItems, { ...productToAdd, quantity }];
            }
        });
    };

    const totalCartItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

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
                    onClick={() => router.push("/resident/shop/cart")}
                    className="ml-4 relative"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {totalCartItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {totalCartItems}
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
