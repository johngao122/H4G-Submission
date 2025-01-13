"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuickAction from "@/components/quickAction";
import VoucherBalance from "@/components/voucherBalance";
import TopBar from "@/components/topbar";
import { ShoppingBag, ClipboardList, History, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRoleCheck } from "@/hooks/useRoleCheck";

const SAMPLE_TRANSACTIONS = [
    //remove when API is up
    {
        id: 1,
        description: "Purchase: Snack Pack",
        amount: -2.5,
        date: "2025-01-12 14:30",
    },
    {
        id: 2,
        description: "Task Reward: Room Cleaning",
        amount: 5.0,
        date: "2025-01-11 09:15",
    },
    {
        id: 3,
        description: "Purchase: Stationery Set",
        amount: -3.75,
        date: "2025-01-10 16:45",
    },
    {
        id: 4,
        description: "Task Reward: Homework Help",
        amount: 4.0,
        date: "2025-01-09 11:20",
    },
    {
        id: 5,
        description: "Purchase: Toiletries",
        amount: -6.25,
        date: "2025-01-08 13:50",
    },
];

export default function ResidentDashboard() {
    const router = useRouter();
    const { isSignedIn, user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please sign in to access your dashboard</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Hi, {user.firstName}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Welcome back to your dashboard
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <QuickAction
                            icon={ShoppingBag}
                            title="Shop"
                            onClick={() => router.push("/resident/shop")}
                        />
                        <QuickAction
                            icon={ClipboardList}
                            title="Request Items"
                            onClick={() => router.push("/resident/request")}
                        />
                        <QuickAction
                            icon={History}
                            title="Transaction History"
                            onClick={() => console.log("History clicked")}
                        />
                        <QuickAction
                            icon={CheckSquare}
                            title="Tasks"
                            onClick={() => console.log("Tasks clicked")}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Your Balance
                        </h2>
                        <VoucherBalance balance={15} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Recent Transactions
                        </h2>
                        <Card>
                            <CardHeader>
                                <CardTitle>Transaction History</CardTitle>
                            </CardHeader>
                            <ScrollArea className="h-[300px] w-full">
                                <CardContent>
                                    <div className="space-y-4">
                                        {SAMPLE_TRANSACTIONS.map(
                                            (transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                transaction.description
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {transaction.date}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`font-semibold ${
                                                            transaction.amount >
                                                            0
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {transaction.amount > 0
                                                            ? "+"
                                                            : ""}
                                                        $
                                                        {Math.abs(
                                                            transaction.amount
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </ScrollArea>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
