"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ShoppingCart, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ShopItem from "./shopItem";
import { useRouter } from "next/navigation";
import { Product } from "@/app/types/shop";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/hooks/use-toast";

interface ApiProduct {
    productId: string;
    name: string;
    category: string;
    desc: string;
    price: number;
    quantity: number;
    productPhoto: string;
}

const Shop: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(["all"]);
    const [isLoading, setIsLoading] = useState(true);
    const { totalItems, addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/products`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const apiProducts: ApiProduct[] = await response.json();

                // Transform API products to match our Product interface
                const transformedProducts: Product[] = apiProducts.map((p) => ({
                    id: p.productId,
                    name: p.name,
                    description: p.desc,
                    price: p.price,
                    imageUrl: p.productPhoto || "/api/placeholder/300/200",
                    quantity: p.quantity,
                    Category: p.category,
                }));

                setProducts(transformedProducts);

                // Extract unique categories
                const uniqueCategories = [
                    "all",
                    ...new Set(apiProducts.map((p) => p.category)),
                ];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast({
                    title: "Error",
                    description:
                        "Failed to load products. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [toast]);

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" || product.Category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (productId: string, quantity: number) => {
        const productToAdd = products.find((p) => p.id === productId);
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

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={() =>
                            router.push("/resident/dashboard/shop/cart")
                        }
                        className="relative"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <ShopItem
                        key={product.id}
                        {...product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No products found matching your criteria
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
