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

interface Product {
    productId: string;
    name: string;
    category: string;
    desc: string;
    price: number;
    quantity: number;
    productPhoto: string;
}

interface ProductLog {
    logId: string;
    userId: string;
    productId: string;
    datetime: string;
    action: string;
}

interface InventoryAlert {
    id: string;
    item: string;
    status: "Low Stock" | "Out of Stock";
    quantity: number;
    date: string;
}

interface Activity {
    id: string;
    description: string;
    type: string;
    date: string;
}

const AdminDashboard = () => {
    const router = useRouter();
    const { isSignedIn, user, isLoaded } = useUser();
    const { isAuthorized, isChecking, AccessDenied } = useAdminAuth();
    const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>(
        []
    );
    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatActionDescription = (log: ProductLog): string => {
        if (log.action === "DELETE") {
            return "Product deleted from inventory";
        }

        if (log.action.startsWith("UPDATE:")) {
            const match = log.action.match(/name=(.*?),.*quantity=(\d+)/);
            if (match) {
                const [_, productName, quantity] = match;
                return `Updated quantity for ${productName} to ${quantity}`;
            }
            return "Product updated in inventory";
        }

        if (log.action.startsWith("CREATE:")) {
            const match = log.action.match(/name=(.*?),/);
            if (match) {
                return `New product added: ${match[1]}`;
            }
            return "New product added to inventory";
        }

        return "Inventory action performed";
    };

    const fetchData = async () => {
        try {
            const productsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/products`
            );
            if (!productsResponse.ok)
                throw new Error("Failed to fetch products");
            const products: Product[] = await productsResponse.json();

            const alerts: InventoryAlert[] = products
                .filter((product) => product.quantity < 10)
                .map((product) => ({
                    id: product.productId,
                    item: product.name,
                    status:
                        product.quantity === 0 ? "Out of Stock" : "Low Stock",
                    quantity: product.quantity,
                    date: new Date().toISOString(),
                }));

            const logsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/product-logs`
            );
            if (!logsResponse.ok)
                throw new Error("Failed to fetch product logs");
            const logs: ProductLog[] = await logsResponse.json();

            const activities: Activity[] = logs.slice(0, 10).map((log) => ({
                id: log.logId,
                description: formatActionDescription(log),
                type: "inventory",
                date: new Date(log.datetime).toLocaleString(),
            }));

            setInventoryAlerts(alerts);
            setRecentActivities(activities);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/admin/login");
            return;
        }

        if (isAuthorized) {
            fetchData();

            const interval = setInterval(fetchData, 300000);
            return () => clearInterval(interval);
        }
    }, [isLoaded, user, isAuthorized]);

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
                            title="Add new task"
                            onClick={() =>
                                router.push("/admin/dashboard/tasks/createTask")
                            }
                        />
                        <QuickAction
                            icon={BarChart3}
                            title="Generate a report"
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
                                    {loading ? (
                                        <p className="text-center py-4">
                                            Loading...
                                        </p>
                                    ) : error ? (
                                        <p className="text-center text-red-500 py-4">
                                            {error}
                                        </p>
                                    ) : inventoryAlerts.length === 0 ? (
                                        <p className="text-center py-4">
                                            No inventory alerts
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {inventoryAlerts.map((alert) => (
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
                                            ))}
                                        </div>
                                    )}
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
                                <CardTitle>Inventory Activities</CardTitle>
                            </CardHeader>
                            <ScrollArea className="h-[300px] w-full">
                                <CardContent>
                                    {loading ? (
                                        <p className="text-center py-4">
                                            Loading...
                                        </p>
                                    ) : error ? (
                                        <p className="text-center text-red-500 py-4">
                                            {error}
                                        </p>
                                    ) : recentActivities.length === 0 ? (
                                        <p className="text-center py-4">
                                            No recent activities
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentActivities.map(
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
                                                        <span className="px-2 py-1 rounded bg-purple-100 text-purple-800">
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
                                    )}
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
