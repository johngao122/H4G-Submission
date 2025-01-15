"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TopBar from "@/components/topbar";

export default function ProductRequestPage() {
    const { userId } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        productName: "",
        productDescription: "",
    });
    const [lastSubmittedRequest, setLastSubmittedRequest] = useState(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            toast({
                title: "Error",
                description:
                    "You must be logged in to submit a product request",
                variant: "destructive",
            });
            return;
        }

        if (!formData.productName || !formData.productDescription) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/product-requests`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        productName: formData.productName,
                        productDescription: formData.productDescription,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit product request");
            }

            const responseData = await response.json();
            setLastSubmittedRequest(responseData);

            toast({
                title: "Success",
                description:
                    "Your product request has been submitted successfully",
            });

            // Reset form
            setFormData({
                productName: "",
                productDescription: "",
            });
        } catch (error) {
            toast({
                title: "Error",
                description:
                    "Failed to submit product request. Please try again later.",
                variant: "destructive",
            });
            console.error("Error submitting product request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Request a Product
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Can't find what you're looking for? Submit a
                                request for products you'd like to see in the
                                shop.
                            </p>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Before submitting a request</AlertTitle>
                        <AlertDescription>
                            Please check if the product is already available in
                            our shop. Your request will be reviewed by our
                            staff.
                        </AlertDescription>
                    </Alert>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Product Request Form
                            </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="productName"
                                        className="text-sm font-medium"
                                    >
                                        Product Name
                                    </label>
                                    <Input
                                        id="productName"
                                        placeholder="Enter product name (e.g., Brand XYZ Toothpaste)"
                                        value={formData.productName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                productName: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="productDescription"
                                        className="text-sm font-medium"
                                    >
                                        Product Description
                                    </label>
                                    <Textarea
                                        id="productDescription"
                                        placeholder="Please provide specific details about the product (e.g., size, brand, type)"
                                        value={formData.productDescription}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                productDescription:
                                                    e.target.value,
                                            }))
                                        }
                                        className="min-h-[120px]"
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Submit Request"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {lastSubmittedRequest && (
                        <Alert className="bg-green-50 border-green-200">
                            <AlertTitle className="text-green-800">
                                Request Submitted Successfully
                            </AlertTitle>
                            <AlertDescription className="text-green-700">
                                Thank you for your request. Our team will review
                                it and update the shop inventory accordingly.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </main>
        </div>
    );
}
