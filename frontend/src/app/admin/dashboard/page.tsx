"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuickAction from "@/components/quickAction";
import TopBarAdmin from "@/components/topbarAdmin";
import { Package, Users, ClipboardList, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const SAMPLE_INVENTORY_ALERTS = [
    //Replace with API implementation
    {
        id: 1,
        item: "Toiletries Pack",
        status: "Low Stock",
        quantity: 5,
        date: "2025-01-12 14:30",
    },
    {
        id: 2,
        item: "School Supplies Set",
        status: "Out of Stock",
        quantity: 0,
        date: "2025-01-11 09:15",
    },
    {
        id: 3,
        item: "Snack Pack",
        status: "Low Stock",
        quantity: 8,
        date: "2025-01-10 16:45",
    },
];

const SAMPLE_RECENT_ACTIVITIES = [
    //This is for audit logs
    //Replace with API implementation
    {
        id: 1,
        description: "New task created: Room Cleaning",
        type: "task",
        date: "2025-01-12 14:30",
    },
    {
        id: 2,
        description: "User John D. completed purchase",
        type: "purchase",
        date: "2025-01-11 09:15",
    },
    {
        id: 3,
        description: "Inventory updated: Stationery Set",
        type: "inventory",
        date: "2025-01-10 16:45",
    },
];

const AdminDashboard = () => {
    const router = useRouter();
    const { isSignedIn, user, isLoaded } = useUser();
    const { isAuthorized, isChecking, AccessDenied } = useAdminAuth();

    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/admin/login");
        }
    }, [isLoaded, user, router]);

    if (!isLoaded || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (!isAuthorized) {
        return <AccessDenied />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage your welfare home operations
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <QuickAction
                            icon={Package}
                            title="Add new product"
                            onClick={() =>
                                router.push("/admin/dashboard/inventory/new")
                            }
                        />
                        <QuickAction
                            icon={Users}
                            title="Add new user"
                            onClick={() =>
                                router.push("/admin/dashboard/users/createUser")
                            }
                        />
                        <QuickAction
                            icon={ClipboardList}
                            title="Manage Tasks"
                            onClick={() =>
                                router.push("/admin/dashboard/tasks/createTask")
                            }
                        />
                        <QuickAction
                            icon={BarChart3}
                            title="Reports"
                            onClick={() =>
                                router.push("/admin/dashboard/reports")
                            }
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Inventory Alerts
                        </h2>
                        <Card>
                            <CardHeader>
                                <CardTitle>Stock Status</CardTitle>
                            </CardHeader>
                            <ScrollArea className="h-[300px] w-full">
                                <CardContent>
                                    <div className="space-y-4">
                                        {SAMPLE_INVENTORY_ALERTS.map(
                                            (alert) => (
                                                <div
                                                    key={alert.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {alert.item}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Quantity:{" "}
                                                            {alert.quantity}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-2 py-1 rounded ${
                                                            alert.status ===
                                                            "Out of Stock"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {alert.status}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </ScrollArea>
                        </Card>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Recent Activities
                        </h2>
                        <Card>
                            <CardHeader>
                                <CardTitle>System Activities</CardTitle>
                            </CardHeader>
                            <ScrollArea className="h-[300px] w-full">
                                <CardContent>
                                    <div className="space-y-4">
                                        {SAMPLE_RECENT_ACTIVITIES.map(
                                            (activity) => (
                                                <div
                                                    key={activity.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {
                                                                activity.description
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {activity.date}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-2 py-1 rounded ${
                                                            activity.type ===
                                                            "task"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : activity.type ===
                                                                  "purchase"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-purple-100 text-purple-800"
                                                        }`}
                                                    >
                                                        {activity.type
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            activity.type.slice(
                                                                1
                                                            )}
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
};

export default AdminDashboard;
