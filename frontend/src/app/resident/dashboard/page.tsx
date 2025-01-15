"use client";
import React from "react";
import VoucherBalance from "@/components/voucherBalance";
import TopBar from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

// Sample data - remove when API is ready
const SAMPLE_TRANSACTIONS = [
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

const SAMPLE_TASKS = [
    {
        id: "1",
        name: "Room Cleaning",
        description: "Help clean the common room",
        reward: 5.0,
        status: "OPEN",
    },
    {
        id: "2",
        name: "Kitchen Assistant",
        description: "Help with meal preparation",
        reward: 4.0,
        status: "OPEN",
    },
    {
        id: "3",
        name: "Study Group Leader",
        description: "Lead evening study session",
        reward: 6.0,
        status: "CLOSED",
    },
];

export default function ResidentDashboard() {
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
                    <p className="text-gray-600 mt-1">
                        Welcome back to your dashboard
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <VoucherBalance balance={15} />

                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                Available Tasks
                            </h2>
                            <div className="space-y-4">
                                {SAMPLE_TASKS.map((task) => (
                                    <Card key={task.id} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold">
                                                {task.name}
                                            </h3>
                                            <Badge
                                                variant={
                                                    task.status === "OPEN"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className={`px-2 py-1 text-xs ${
                                                    task.status === "OPEN"
                                                        ? "bg-black text-white"
                                                        : "bg-gray-200 text-gray-700"
                                                }`}
                                            >
                                                {task.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {task.description}
                                        </p>
                                        <p className="text-sm mt-2">
                                            Reward: ${task.reward.toFixed(2)}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            Recent Transactions
                        </h2>
                        <Card>
                            <ScrollArea className="">
                                <div className="p-6">
                                    {SAMPLE_TRANSACTIONS.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {transaction.date}
                                                </p>
                                            </div>
                                            <span
                                                className={`${
                                                    transaction.amount > 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {transaction.amount > 0
                                                    ? "+"
                                                    : "-"}
                                                $
                                                {Math.abs(
                                                    transaction.amount
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
