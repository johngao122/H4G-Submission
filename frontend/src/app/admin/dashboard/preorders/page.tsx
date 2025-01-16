"use client";

import React, { useEffect, useState } from "react";
import PreorderCard from "@/components/preorderCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import type { Preorder, User } from "@/app/types/preorder";
import TopBarAdmin from "@/components/topbarAdmin";

const PreordersPage = () => {
    const [preorders, setPreorders] = useState<Preorder[]>([]);
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFulfilling, setIsFulfilling] = useState(false);
    const { toast } = useToast();
    const { userId } = useAuth();

    const fetchPreorders = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/preorders`
            );
            if (!response.ok) throw new Error("Failed to fetch preorders");
            const data = await response.json();
            setPreorders(data);
        } catch (error) {
            console.error("Error fetching preorders:", error);
            toast({
                title: "Error",
                description: "Failed to load preorders",
                variant: "destructive",
            });
        }
    };

    const fetchUserData = async () => {
        if (!userId) return;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/users/${userId}`
            );
            if (!response.ok) throw new Error("Failed to fetch user data");
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast({
                title: "Error",
                description: "Failed to load user data",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchPreorders(), fetchUserData()]);
            setIsLoading(false);
        };
        loadData();
    }, [userId]);

    const handleFulfillPreorder = async (preorderId: string) => {
        setIsFulfilling(true);
        try {
            // Get the preorder details first
            const preorder = preorders.find((p) => p.preorderId === preorderId);
            if (!preorder) throw new Error("Preorder not found");

            // Update preorder status to fulfilled
            const statusResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/preorders/${preorderId}/status?status=FULFILLED`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!statusResponse.ok)
                throw new Error("Failed to update preorder status");

            // Create transaction
            const transactionResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/transactions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: preorder.userId,
                        productId: preorder.productId,
                        qtyPurchased: preorder.qtyPreordered,
                    }),
                }
            );

            if (!transactionResponse.ok)
                throw new Error("Failed to create transaction");

            // Update product stock

            try {
                // First fetch current product data
                const productResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/products/${preorder.productId}`
                );
                if (!productResponse.ok)
                    throw new Error("Failed to fetch product data");
                const productData = await productResponse.json();

                // Calculate new quantity and update
                const newQuantity =
                    productData.quantity - preorder.qtyPreordered;
                const updateResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/products/${preorder.productId}/quantity?quantity=${newQuantity}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            userId: preorder.userId,
                        },
                    }
                );

                if (!updateResponse.ok)
                    throw new Error("Failed to update product quantity");
            } catch (error) {
                console.error("Error updating product:", error);
                throw new Error("Failed to update product stock");
            } finally {
                setIsFulfilling(false);
            }

            // Update user's voucher balance
            try {
                // First fetch current user data
                const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/users/${preorder.userId}`
                );
                if (!userResponse.ok)
                    throw new Error("Failed to fetch user data");
                const userData = await userResponse.json();

                // Calculate new balance and update user data
                const newBalance = userData.voucherBal - preorder.totalPrice;
                const updateUserResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/users/${preorder.userId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...userData, // Keep all existing user data
                            voucherBal: newBalance, // Update only the balance
                        }),
                    }
                );

                if (!updateUserResponse.ok)
                    throw new Error("Failed to update user balance");
            } catch (error) {
                console.error("Error updating user balance:", error);
                throw new Error("Failed to update user balance");
            }
            // Refresh the data
            await Promise.all([fetchPreorders(), fetchUserData()]);

            toast({
                title: "Success",
                description: "Preorder fulfilled successfully",
            });
        } catch (error) {
            console.error("Error fulfilling preorder:", error);
            toast({
                title: "Error",
                description: "Failed to fulfill preorder",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <TopBarAdmin />
            <h1 className="text-2xl font-bold mb-8 pt-10">Preorders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {preorders.map((preorder) => (
                    <PreorderCard
                        key={preorder.preorderId}
                        preorder={preorder}
                        onFulfill={handleFulfillPreorder}
                        userData={userData ?? undefined}
                    />
                ))}
            </div>
        </div>
    );
};

export default PreordersPage;
