"use client";

import React, { useState, useEffect } from "react";
import TopBarAdmin from "@/components/topbarAdmin";
import ProductTable from "@/components/productTable";
import { Product } from "@/app/types/shop";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface APIProduct {
    productId: string;
    name: string;
    category: string;
    desc: string;
    price: number;
    quantity: number;
    productPhoto: string;
}

const mapAPIProductToProduct = (apiProduct: APIProduct): Product => ({
    id: apiProduct.productId,
    name: apiProduct.name,
    description: apiProduct.desc,
    price: apiProduct.price,
    imageUrl: apiProduct.productPhoto || "/api/placeholder/300/200",
    quantity: apiProduct.quantity,
    Category: apiProduct.category,
});

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeletingProducts, setIsDeletingProducts] = useState(false);
    const { toast } = useToast();
    const { userId } = useAuth();
    const baseUrl = process.env.NEXT_PUBLIC_API;

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${baseUrl}/products`);
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data: APIProduct[] = await response.json();
            const mappedProducts = data.map(mapAPIProductToProduct);
            setProducts(mappedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({
                title: "Error",
                description: "Failed to fetch products. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProductImage = async (imageUrl: string) => {
        if (!imageUrl || imageUrl === "/api/placeholder/300/200") return;

        try {
            const url = new URL(
                "/api/delete-product-image",
                window.location.origin
            );
            url.searchParams.set("url", imageUrl);

            const response = await fetch(url, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete image from blob storage");
            }
        } catch (error) {
            console.error("Error deleting image from blob storage:", error);
            throw error;
        }
    };

    const handleBulkDeleteProducts = async (productIds: string[]) => {
        if (!userId) {
            toast({
                title: "Error",
                description: "You must be logged in to delete products.",
                variant: "destructive",
            });
            return;
        }

        setIsDeletingProducts(true);
        const failedDeletions: string[] = [];

        try {
            await Promise.all(
                productIds.map(async (productId) => {
                    try {
                        const product = products.find(
                            (p) => p.id === productId
                        );
                        if (!product) return;

                        if (product.imageUrl) {
                            await deleteProductImage(product.imageUrl);
                        }

                        const response = await fetch(
                            `${baseUrl}/products/${productId}`,
                            {
                                method: "DELETE",
                                headers: {
                                    userId: userId,
                                },
                            }
                        );

                        if (!response.ok) {
                            throw new Error(
                                `Failed to delete product ${productId}`
                            );
                        }
                    } catch (error) {
                        console.error(
                            `Error deleting product ${productId}:`,
                            error
                        );
                        failedDeletions.push(productId);
                    }
                })
            );

            setProducts((prevProducts) =>
                prevProducts.filter(
                    (product) =>
                        !productIds.includes(product.id) ||
                        failedDeletions.includes(product.id)
                )
            );

            if (failedDeletions.length === 0) {
                toast({
                    title: "Success",
                    description: `Successfully deleted ${
                        productIds.length
                    } product${productIds.length > 1 ? "s" : ""}.`,
                });
            } else if (failedDeletions.length === productIds.length) {
                toast({
                    title: "Error",
                    description:
                        "Failed to delete the selected products. Please try again.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Partial Success",
                    description: `Deleted ${
                        productIds.length - failedDeletions.length
                    } products. Failed to delete ${
                        failedDeletions.length
                    } products.`,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error in bulk delete:", error);
            toast({
                title: "Error",
                description:
                    "An unexpected error occurred while deleting products.",
                variant: "destructive",
            });
        } finally {
            setIsDeletingProducts(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        await handleBulkDeleteProducts([productId]);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopBarAdmin />
                <main className="container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading products...</span>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <main className="container mx-auto px-4 py-8">
                <ProductTable
                    products={products}
                    onDeleteProduct={handleDeleteProduct}
                    onBulkDelete={handleBulkDeleteProducts}
                    isDeleting={isDeletingProducts}
                />
            </main>
        </div>
    );
}
