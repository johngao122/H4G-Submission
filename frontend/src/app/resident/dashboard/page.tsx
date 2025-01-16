"use client";
import React, { useEffect, useState } from "react";
import VoucherBalance from "@/components/voucherBalance";
import TopBar from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

// Type definitions for API responses
interface TaskContributor {
    taskId: string;
    userId: string;
    datetime: string;
    status: string;
}

interface Task {
    taskId: string;
    taskName: string;
    taskDesc: string;
    taskReward: number;
    datetime: string;
    contributors: TaskContributor[];
    status: "OPEN" | "CLOSED";
}

interface Transaction {
    transactionId: string;
    userId: string;
    productId: string;
    qtyPurchased: number;
    totalPrice: number;
    datetime: string;
}

interface UserDetails {
    userId: string;
    name: string;
    voucherBal: number;
    role: string;
    status: string;
}

export default function ResidentDashboard() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [voucherBalance, setVoucherBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/users/${user.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!userResponse.ok)
                    throw new Error("Failed to fetch voucher balance");
                const userData: UserDetails = await userResponse.json();
                setVoucherBalance(userData.voucherBal);

                const tasksResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/tasks`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
                const tasksData = await tasksResponse.json();
                setTasks(tasksData);

                const transactionsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/transactions/user/${user.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!transactionsResponse.ok)
                    throw new Error("Failed to fetch transactions");
                const transactionsData = await transactionsResponse.json();
                setTransactions(transactionsData);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <a href="/">Please sign in to access your dashboard</a>
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

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <VoucherBalance balance={voucherBalance} />

                        <div>
                            <h2 className="text-xl font-bold mb-4">
                                Available Tasks
                            </h2>
                            {tasks.length === 0 ? (
                                <Card className="p-6">
                                    <p className="text-gray-500 text-center">
                                        No tasks available
                                    </p>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {tasks.map((task) => (
                                        <Card key={task.taskId} className="p-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold">
                                                    {task.taskName}
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
                                                {task.taskDesc}
                                            </p>
                                            <p className="text-sm mt-2">
                                                Reward: $
                                                {task.taskReward.toFixed(2)}
                                            </p>
                                            {task.contributors.length > 0 && (
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Contributors:{" "}
                                                    {task.contributors.length}
                                                </p>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            Recent Transactions
                        </h2>
                        <Card>
                            <ScrollArea>
                                <div className="p-6">
                                    {transactions.length === 0 ? (
                                        <p className="text-gray-500 text-center">
                                            No recent transactions
                                        </p>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <div
                                                key={transaction.transactionId}
                                                className="flex items-center justify-between py-3"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        Transaction:{" "}
                                                        {transaction.productId}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(
                                                            transaction.datetime+"Z"
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className="text-red-600">
                                                    -$
                                                    {transaction.totalPrice.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
