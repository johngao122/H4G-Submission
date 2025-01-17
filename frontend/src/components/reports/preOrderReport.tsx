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
import { PreorderReportProps, Preorder } from "@/app/types/reports";

export function PreorderReport({ data }: PreorderReportProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof Preorder;
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

    const formatDate = (dateString: string) =>
        format(new Date(dateString), "MMM d, yyyy HH:mm:ss");

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);

    const additionalStats = React.useMemo(() => {
        const pendingValue = data.data
            .filter((order: Preorder) => order.status === "PENDING")
            .reduce(
                (sum: number, order: Preorder) => sum + order.totalPrice,
                0
            );

        const fulfilledValue = data.data
            .filter((order: Preorder) => order.status === "FULFILLED")
            .reduce(
                (sum: number, order: Preorder) => sum + order.totalPrice,
                0
            );

        const uniqueUsers = new Set(
            data.data.map((order: Preorder) => order.userId)
        ).size;

        return {
            pendingValue,
            fulfilledValue,
            uniqueUsers,
        };
    }, [data.data]);

    const MobilePreorderCard = ({ preorder }: { preorder: Preorder }) => (
        <Card className="mb-4">
            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(
                                    preorder.status
                                )}`}
                            >
                                {preorder.status}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            {formatDate(preorder.datetime)}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <span className="text-sm font-medium">
                                Preorder ID:{" "}
                            </span>
                            <span className="text-sm font-mono">
                                {preorder.preorderId}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium">
                                User ID:{" "}
                            </span>
                            <span className="text-sm font-mono">
                                {preorder.userId}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium">
                                Product ID:{" "}
                            </span>
                            <span className="text-sm font-mono">
                                {preorder.productId}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 border-t flex justify-between items-center">
                        <div>
                            <span className="text-sm font-medium">
                                Quantity:{" "}
                            </span>
                            <span className="text-sm">
                                {preorder.qtyPreordered}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium">Total: </span>
                            <span className="text-sm">
                                {formatCurrency(preorder.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const filteredAndSortedPreorders = React.useMemo(() => {
        let filtered = [...data.data];

        if (statusFilter !== "ALL") {
            filtered = filtered.filter(
                (order) => order.status === statusFilter
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order.userId.toLowerCase().includes(query) ||
                    order.productId.toLowerCase().includes(query) ||
                    order.preorderId.toLowerCase().includes(query)
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
                case "totalPrice":
                case "qtyPreordered":
                    comparison = a[sortConfig.key] - b[sortConfig.key];
                    break;
                default:
                    comparison = a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            }
            return sortConfig.direction === "asc" ? comparison : -comparison;
        });

        return filtered;
    }, [data.data, statusFilter, searchQuery, sortConfig]);

    const handleSort = (key: keyof Preorder) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "FULFILLED":
                return "bg-green-100 text-green-700";
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {data.summary.totalCount}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Total Preorders
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {formatCurrency(data.summary.totalValue)}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Total Value
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {formatCurrency(data.summary.averageValue)}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Average Order Value
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {data.summary.uniqueUsers}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Unique Users
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Pending Orders
                                </span>
                                <span className="text-sm font-medium">
                                    {data.summary.statusBreakdown.pending}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Pending Value
                                </span>
                                <span className="text-sm font-medium">
                                    {formatCurrency(
                                        additionalStats.pendingValue
                                    )}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Fulfilled Orders
                                </span>
                                <span className="text-sm font-medium">
                                    {data.summary.statusBreakdown.fulfilled}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Fulfilled Value
                                </span>
                                <span className="text-sm font-medium">
                                    {formatCurrency(
                                        additionalStats.fulfilledValue
                                    )}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search preorders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isMobile ? (
                <div className="space-y-4">
                    {filteredAndSortedPreorders.map((preorder) => (
                        <MobilePreorderCard
                            key={preorder.preorderId}
                            preorder={preorder}
                        />
                    ))}
                    {filteredAndSortedPreorders.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No preorders found</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("datetime")}
                                >
                                    Date & Time{" "}
                                    {sortConfig.key === "datetime" &&
                                        (sortConfig.direction === "asc"
                                            ? "↑"
                                            : "↓")}
                                </TableHead>
                                <TableHead>Preorder ID</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Product ID</TableHead>
                                <TableHead className="text-right">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-right">
                                    Total Price
                                </TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedPreorders.map((preorder) => (
                                <TableRow key={preorder.preorderId}>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDate(preorder.datetime)}
                                    </TableCell>
                                    <TableCell>{preorder.preorderId}</TableCell>
                                    <TableCell>{preorder.userId}</TableCell>
                                    <TableCell>{preorder.productId}</TableCell>
                                    <TableCell className="text-right">
                                        {preorder.qtyPreordered}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(preorder.totalPrice)}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(
                                                preorder.status
                                            )}`}
                                        >
                                            {preorder.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default PreorderReport;
