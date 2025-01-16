"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Pencil, ArrowLeft } from "lucide-react";
import { Product } from "@/app/types/shop";
import { ProductDetailsPageProps } from "@/app/types/details";
import { useToast } from "@/hooks/use-toast";
import TopBarAdmin from "@/components/topbarAdmin";
import { useUser } from "@clerk/nextjs";

export default function ProductDetailsPage({
    params,
}: ProductDetailsPageProps) {
    const resolvedParams = React.use(params);
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useUser();
    const [product, setProduct] = React.useState<Product | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/products/${resolvedParams.productId}`,
                    {
                        headers: {
                            userId: user?.id || "",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }

                const productData = await response.json();
                setProduct({
                    id: productData.productId,
                    name: productData.name,
                    description: productData.desc,
                    price: productData.price,
                    imageUrl:
                        productData.productPhoto || "/api/placeholder/300/200",
                    quantity: productData.quantity,
                    Category: productData.category,
                });
            } catch (error) {
                console.error("Error fetching product:", error);
                toast({
                    title: "Error",
                    description: "Failed to load product details",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchProduct();
        }
    }, [resolvedParams.productId, user?.id, toast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopBarAdmin />
                <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopBarAdmin />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                    <h1 className="text-2xl font-bold mb-4">
                        Product Not Found
                    </h1>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            router.push("/admin/dashboard/inventory")
                        }
                        className="flex items-center"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Inventory
                    </Button>
                    <Button
                        onClick={() =>
                            router.push(
                                `/admin/dashboard/inventory/${resolvedParams.productId}/edit`
                            )
                        }
                        className="flex items-center"
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Product
                    </Button>
                </div>

                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl mb-2">
                                    {product.name}
                                </CardTitle>
                                <CardDescription>
                                    Product ID: {product.id}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">
                                    ${product.price.toFixed(2)}
                                </div>
                                <div
                                    className={`text-sm font-medium ${
                                        product.quantity > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {product.quantity > 0
                                        ? `${product.quantity} in stock`
                                        : "Out of stock"}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-1">
                                    Category
                                </h3>
                                <p>{product.Category}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-1">
                                    Last Updated
                                </h3>
                                <p>Not available</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600 mb-1">
                                Description
                            </h3>
                            <p className="text-gray-700">
                                {product.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
