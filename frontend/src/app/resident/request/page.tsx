"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/topbar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { ProductRequestSubmission } from "@/app/types/productRequest";

interface FormData {
    productName: string;
    productDescription: string;
}

const ProductRequestPage = () => {
    const { userId } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<FormData>({
        defaultValues: {
            productName: "",
            productDescription: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        const productRequest: ProductRequestSubmission = {
            UserId: userId || "",
            ProductName: data.productName,
            ProductDescription: data.productDescription,
            DateTime: new Date().toISOString(),
        };

        try {
            //Replace with API call
            console.log("Submitting product request:", productRequest);

            toast({
                title: "Request Submitted",
                description:
                    "Your product request has been submitted successfully",
            });

            form.reset();
        } catch (error) {
            console.error("Submission error:", error);
            toast({
                title: "Submission Failed",
                description:
                    "There was an error submitting your request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Product Request Form</CardTitle>
                        <CardDescription>
                            Submit a request for a new product to be added to
                            the store
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="productName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter product name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="productDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Product Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter product description"
                                                    className="min-h-32"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Please provide a detailed
                                                description of the product you
                                                would like to request
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Submit Request"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductRequestPage;
