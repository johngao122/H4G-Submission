"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import TopBarAdmin from "@/components/topbarAdmin";

interface ProductCreateForm {
    name: string;
    category: string;
    desc: string;
    price: number;
    quantity: number;
    productPhoto: string;
}

export default function ProductCreatePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const { user } = useUser();

    const [formData, setFormData] = useState<ProductCreateForm>({
        name: "",
        category: "",
        desc: "",
        price: 0,
        quantity: 0,
        productPhoto: "",
    });

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

            setSelectedImage(file);

            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "price" || name === "quantity"
                    ? Math.max(0, parseFloat(value) || 0)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let photoUrl = "";
            if (selectedImage) {
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

                const { photoUrl: uploadedUrl } = await uploadResponse.json();
                photoUrl = uploadedUrl;
            }

            const productData = {
                ...formData,
                productPhoto: photoUrl,
            };

            const createResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/products`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        userId: user?.id || "",
                    },
                    body: JSON.stringify(productData),
                }
            );

            if (!createResponse.ok) {
                throw new Error("Failed to create product");
            }

            toast({
                title: "Success",
                description: "Product created successfully",
            });

            router.push("/admin/dashboard/inventory");
        } catch (error) {
            console.error("Error creating product:", error);
            toast({
                title: "Error",
                description: "Failed to create product",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <main className="container mx-auto px-4 py-8">
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
                        <CardTitle>Create New Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <Label>Product Image</Label>
                                <div className="flex items-start space-x-4">
                                    <div className="relative">
                                        <div className="w-40 h-40 border rounded-lg overflow-hidden">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    No image
                                                </div>
                                            )}
                                        </div>
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
                                <Label htmlFor="desc">Description</Label>
                                <Textarea
                                    id="desc"
                                    name="desc"
                                    value={formData.desc}
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
                                        step="0.5"
                                        value={
                                            formData.price === 0
                                                ? ""
                                                : formData.price
                                        }
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
                                        value={
                                            formData.quantity === 0
                                                ? ""
                                                : formData.quantity
                                        }
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={formData.category}
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
                                    {saving ? "Creating..." : "Create Product"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
