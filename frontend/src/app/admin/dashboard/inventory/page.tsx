"use client";

import React, { useState } from "react";
import TopBarAdmin from "@/components/topbarAdmin";
import ProductTable from "@/components/productTable";
import { Product } from "@/app/types/shop";
import { useToast } from "@/hooks/use-toast";

// Replace with API
const SAMPLE_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Rice (5kg)",
        description: "Premium quality jasmine rice",
        price: 12.99,
        imageUrl: "/api/placeholder/300/200",
        quantity: 50,
        Category: "Groceries",
    },
    {
        id: "2",
        name: "Instant Noodles (Pack of 5)",
        description: "Assorted flavors instant noodles",
        price: 3.99,
        imageUrl: "/api/placeholder/300/200",
        quantity: 100,
        Category: "Groceries",
    },
    {
        id: "3",
        name: "Toothpaste",
        description: "Fluoride toothpaste with mint flavor",
        price: 2.99,
        imageUrl: "/api/placeholder/300/200",
        quantity: 75,
        Category: "Personal Care",
    },
];

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
    const { toast } = useToast();

    const handleDeleteProduct = async (productId: string) => {
        try {
            // TODO: Replace with actual API call
            // await deleteProduct(productId);

            setProducts(products.filter((product) => product.id !== productId));

            toast({
                title: "Product deleted",
                description: "The product has been successfully removed.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete the product. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleUpdateProduct = async (product: Product) => {
        try {
            // TODO: Replace with actual API call
            // await updateProduct(product);

            setProducts(
                products.map((p) => (p.id === product.id ? product : p))
            );

            toast({
                title: "Product updated",
                description: "The product has been successfully updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update the product. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <main className="container mx-auto px-4 py-8">
                <ProductTable
                    products={products}
                    onDeleteProduct={handleDeleteProduct}
                    onUpdateProduct={handleUpdateProduct}
                />
            </main>
        </div>
    );
}
