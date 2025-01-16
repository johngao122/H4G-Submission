"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Product } from "@/app/types/shop";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import TopBarAdmin from "@/components/topbarAdmin";

interface ProductEditPageProps {
    params: Promise<{ productId: string }>;
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
    const resolvedParams = React.use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [formData, setFormData] = React.useState<Product | null>(null);
    const [originalData, setOriginalData] = React.useState<Product | null>(
        null
    );
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
    const { user } = useUser();

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
                const formattedProduct = {
                    id: productData.productId,
                    name: productData.name,
                    description: productData.desc,
                    price: productData.price,
                    imageUrl:
                        productData.productPhoto || "/api/placeholder/300/200",
                    quantity: productData.quantity,
                    Category: productData.category,
                };

                setFormData(formattedProduct);
                setOriginalData(formattedProduct);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Error",
                    description: "Image size should be less than 5MB",
                    variant: "destructive",
                });
                return;
            }

            if (formData && formData.imageUrl !== originalData?.imageUrl) {
                URL.revokeObjectURL(formData.imageUrl);
            }

            setSelectedImage(file);
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) =>
                prev
                    ? {
                          ...prev,
                          imageUrl,
                      }
                    : null
            );
        }
    };

    const resetImage = () => {
        if (formData && originalData) {
            if (formData.imageUrl !== originalData.imageUrl) {
                URL.revokeObjectURL(formData.imageUrl);
            }

            setFormData({
                ...formData,
                imageUrl: originalData.imageUrl,
            });
            setSelectedImage(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setSaving(true);
        try {
            let finalImageUrl = formData.imageUrl;

            if (selectedImage) {
                if (
                    originalData?.imageUrl &&
                    originalData.imageUrl !== "/api/placeholder/300/200"
                ) {
                    try {
                        const deleteUrl = new URL(
                            "/api/delete-product-image",
                            window.location.origin
                        );
                        deleteUrl.searchParams.set(
                            "url",
                            originalData.imageUrl
                        );

                        const deleteResponse = await fetch(deleteUrl, {
                            method: "DELETE",
                        });

                        if (!deleteResponse.ok) {
                            console.error("Failed to delete old image");
                        }
                    } catch (error) {
                        console.error("Error deleting old image:", error);
                    }
                }

                const imageFormData = new FormData();
                imageFormData.append("file", selectedImage);
                const tempId = `temp_${Date.now()}`;
                imageFormData.append("productId", tempId);

                const uploadResponse = await fetch(
                    "/api/upload-product-image",
                    {
                        method: "POST",
                        body: imageFormData,
                    }
                );

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image");
                }

                const { photoUrl } = await uploadResponse.json();
                finalImageUrl = photoUrl;
            }

            const updateResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/products/${resolvedParams.productId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        userId: user?.id || "",
                    },
                    body: JSON.stringify({
                        productId: formData.id,
                        name: formData.name,
                        category: formData.Category,
                        desc: formData.description,
                        price: formData.price,
                        quantity: formData.quantity,
                        productPhoto: finalImageUrl,
                    }),
                }
            );

            if (!updateResponse.ok) {
                throw new Error("Failed to update product");
            }

            toast({
                title: "Success",
                description: "Product updated successfully",
            });

            router.push(
                `/admin/dashboard/inventory/${resolvedParams.productId}`
            );
        } catch (error) {
            console.error("Error updating product:", error);
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!formData) return;

        const { name, value } = e.target;
        setFormData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]:
                    name === "price" || name === "quantity"
                        ? parseFloat(value) || 0
                        : value,
            };
        });
    };

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

    if (!formData) {
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
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rest of the form JSX remains the same */}
                            <div className="space-y-4">
                                <Label>Product Image</Label>
                                <div className="flex items-start space-x-4">
                                    <div className="relative">
                                        <div className="w-40 h-40 border rounded-lg overflow-hidden">
                                            <img
                                                src={formData.imageUrl}
                                                alt={formData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {selectedImage && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={resetImage}
                                                className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="imageUpload"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "imageUpload"
                                                    )
                                                    ?.click()
                                            }
                                        >
                                            Upload Image
                                        </Button>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Recommended: 300x200 pixels, max 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="Category">Category</Label>
                                <Input
                                    id="Category"
                                    name="Category"
                                    value={formData.Category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
