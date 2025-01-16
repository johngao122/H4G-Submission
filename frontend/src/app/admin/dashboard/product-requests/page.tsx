"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";
import { format } from "date-fns";
import TopBarAdmin from "@/components/topbarAdmin";

interface ProductRequest {
    requestId: string;
    userId: string;
    productName: string;
    productDescription: string;
    datetime: string;
}

interface ProductRequestsPageProps {
    requests: ProductRequest[];
}

interface ProductRequestCardProps {
    request: ProductRequest;
    onActionClick?: (requestId: string) => void;
}

interface ProductRequestFilters {
    searchQuery?: string;
    sortBy?: "date" | "name";
    sortOrder?: "asc" | "desc";
}

const ProductRequests = () => {
    const [requests, setRequests] = useState<ProductRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/product-requests`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch product requests");
                }
                const data = await response.json();
                setRequests(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading requests...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-500">
                    <p>Error: {error}</p>
                </div>
            );
        }

        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Product Requests</h1>
                    <PackageSearch className="h-6 w-6 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                        <Card
                            key={request.requestId}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold">
                                    {request.productName}
                                </CardTitle>
                                <p className="text-sm text-gray-500">
                                    Request ID: {request.requestId}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        {request.productDescription}
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-gray-500 pt-2">
                                        <span>User ID: {request.userId}</span>
                                        <span>
                                            {format(
                                                new Date(request.datetime),
                                                "MMM d, yyyy h:mm a"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {requests.length === 0 && (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">
                                No product requests found
                            </p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <div className="container mx-auto px-4 py-8">{renderContent()}</div>
        </div>
    );
};

export default ProductRequests;
