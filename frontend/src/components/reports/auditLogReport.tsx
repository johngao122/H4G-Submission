"use client";

import React from "react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AuditLogReportProps, AuditLog } from "@/app/types/reports";
import { cn } from "@/lib/utils";

interface ActionDetails {
    type: string;
    details: string | Record<string, string>;
    raw?: string;
}

export function AuditLogReport({ data }: AuditLogReportProps) {
    const [filterAction, setFilterAction] = React.useState<string>("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof AuditLog;
        direction: "asc" | "desc";
    }>({ key: "datetime", direction: "desc" });
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const summary = React.useMemo(() => {
        const uniqueUsers = new Set(data.data.map((log) => log.userId)).size;
        const uniqueProducts = new Set(data.data.map((log) => log.productId))
            .size;
        const actionCounts = data.data.reduce((acc, log) => {
            const type = log.action.split(":")[0];
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalLogs: data.data.length,
            uniqueUsers,
            uniqueProducts,
            actionCounts,
        };
    }, [data]);

    const formatDate = (dateString: string) =>
        format(new Date(dateString), "MMM d, yyyy HH:mm:ss");

    const parseAction = (action: string): ActionDetails => {
        if (action === "DELETE")
            return { type: "DELETE", details: "Item deleted" };

        const [type, details] = action.split(":");
        const productDetails =
            details?.match(/\[(.*?)\]/)?.[1] || details || "";

        const parsedDetails = productDetails
            .split(", ")
            .reduce((acc, detail) => {
                const [key, value] = detail.split("=");
                if (key && value) {
                    acc[key.trim()] = value.trim();
                }
                return acc;
            }, {} as Record<string, string>);

        return {
            type,
            details: parsedDetails,
            raw: productDetails,
        };
    };

    const getActionBadgeColor = (actionType: string) => {
        switch (actionType) {
            case "CREATE":
                return "bg-green-100 text-green-700";
            case "UPDATE":
                return "bg-blue-100 text-blue-700";
            case "DELETE":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const filteredAndSortedLogs = React.useMemo(() => {
        let filtered = [...data.data];

        if (filterAction !== "all") {
            filtered = filtered.filter((log) =>
                log.action.startsWith(filterAction)
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (log) =>
                    log.userId.toLowerCase().includes(query) ||
                    log.productId.toLowerCase().includes(query) ||
                    log.action.toLowerCase().includes(query)
            );
        }

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortConfig.key) {
                case "datetime":
                    comparison =
                        new Date(a.datetime).getTime() -
                        new Date(b.datetime).getTime();
                    break;
                default:
                    comparison = a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            }
            return sortConfig.direction === "asc" ? comparison : -comparison;
        });

        return filtered;
    }, [data, filterAction, searchQuery, sortConfig]);

    const renderProductDetails = (details: Record<string, string>) => {
        const keyMap = {
            name: "Name",
            category: "Category",
            price: "Price",
            quantity: "Quantity",
            desc: "Description",
        };

        return (
            <div className="space-y-1">
                {Object.entries(details).map(([key, value]) => {
                    if (key === "productPhoto" || key === "productId")
                        return null;
                    return (
                        <div key={key} className="text-sm">
                            <span className="font-medium">
                                {keyMap[key as keyof typeof keyMap] || key}:{" "}
                            </span>
                            <span className="text-gray-600">{value}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const MobileAuditCard = ({ log }: { log: AuditLog }) => {
        const { type, details } = parseAction(log.action);
        return (
            <Card className="mb-4">
                <CardContent className="pt-4">
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getActionBadgeColor(
                                    type
                                )}`}
                            >
                                {type}
                            </span>
                            <span className="text-sm text-gray-500">
                                {formatDate(log.datetime)}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <span className="text-sm font-medium">
                                    User ID:{" "}
                                </span>
                                <span className="text-sm font-mono">
                                    {log.userId.split("_")[1]}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium">
                                    Product ID:{" "}
                                </span>
                                <span className="text-sm font-mono">
                                    {log.productId}
                                </span>
                            </div>
                        </div>

                        <div className="pt-2 border-t">
                            <div className="text-sm">
                                {typeof details === "object" ? (
                                    renderProductDetails(details)
                                ) : (
                                    <span className="text-gray-600">
                                        {details}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (!data || data.data.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No audit logs available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {summary.totalLogs}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Total Actions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {summary.uniqueUsers}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Unique Users
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {summary.uniqueProducts}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Unique Products
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(summary.actionCounts).map(
                                ([type, count]) => (
                                    <span
                                        key={type}
                                        className={`px-2 py-1 rounded-full text-xs ${getActionBadgeColor(
                                            type
                                        )}`}
                                    >
                                        {type}: {count}
                                    </span>
                                )
                            )}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-2">
                            Action Breakdown
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="CREATE">Create</SelectItem>
                        <SelectItem value="UPDATE">Update</SelectItem>
                        <SelectItem value="DELETE">Delete</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isMobile ? (
                <div className="space-y-4">
                    {filteredAndSortedLogs.map((log) => (
                        <MobileAuditCard key={log.logId} log={log} />
                    ))}
                </div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[180px]">
                                    Date & Time
                                </TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Product ID</TableHead>
                                <TableHead className="min-w-[400px]">
                                    Details
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedLogs.map((log) => {
                                const { type, details } = parseAction(
                                    log.action
                                );
                                return (
                                    <TableRow key={log.logId}>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDate(log.datetime)}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {log.userId.split("_")[1]}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getActionBadgeColor(
                                                    type
                                                )}`}
                                            >
                                                {type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {log.productId}
                                        </TableCell>
                                        <TableCell>
                                            {typeof details === "object" ? (
                                                renderProductDetails(details)
                                            ) : (
                                                <span className="text-gray-600">
                                                    {details}
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            {filteredAndSortedLogs.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No matching logs found</p>
                </div>
            )}
        </div>
    );
}
