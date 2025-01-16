"use client";

import React from "react";
import { format, subDays, isAfter } from "date-fns";
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
import { Transaction, TransactionReportProps } from "@/app/types/reports";

export function TransactionReport({ data }: TransactionReportProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [timeFilter, setTimeFilter] = React.useState<string>("ALL");
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof Transaction;
        direction: "asc" | "desc";
    }>({ key: "datetime", direction: "desc" });

    const formatDate = (dateString: string) =>
        format(new Date(dateString), "MMM d, yyyy HH:mm:ss");

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);

    const timeBasedMetrics = React.useMemo(() => {
        const now = new Date();
        const last24Hours = subDays(now, 1);
        const last7Days = subDays(now, 7);
        const last30Days = subDays(now, 30);

        const recentTransactions = data.data.filter((tx: Transaction) =>
            isAfter(new Date(tx.datetime), last24Hours)
        );

        const weekTransactions = data.data.filter((tx: Transaction) =>
            isAfter(new Date(tx.datetime), last7Days)
        );

        const monthTransactions = data.data.filter((tx: Transaction) =>
            isAfter(new Date(tx.datetime), last30Days)
        );

        const calculateMetrics = (transactions: Transaction[]) => ({
            count: transactions.length,
            revenue: transactions.reduce((sum, tx) => sum + tx.totalPrice, 0),
            avgValue:
                transactions.length > 0
                    ? transactions.reduce((sum, tx) => sum + tx.totalPrice, 0) /
                      transactions.length
                    : 0,
        });

        return {
            last24Hours: calculateMetrics(recentTransactions),
            last7Days: calculateMetrics(weekTransactions),
            last30Days: calculateMetrics(monthTransactions),
        };
    }, [data.data]);

    const filteredAndSortedTransactions = React.useMemo(() => {
        let filtered = [...data.data];

        const now = new Date();
        if (timeFilter !== "ALL") {
            const filterDate = subDays(
                now,
                timeFilter === "24H" ? 1 : timeFilter === "7D" ? 7 : 30
            );
            filtered = filtered.filter((tx: Transaction) =>
                isAfter(new Date(tx.datetime), filterDate)
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (tx: Transaction) =>
                    tx.transactionId.toLowerCase().includes(query) ||
                    tx.userId.toLowerCase().includes(query) ||
                    tx.productId.toLowerCase().includes(query)
            );
        }

        filtered.sort((a: Transaction, b: Transaction) => {
            let comparison = 0;
            switch (sortConfig.key) {
                case "datetime":
                    comparison =
                        new Date(a.datetime).getTime() -
                        new Date(b.datetime).getTime();
                    break;
                case "totalPrice":
                case "qtyPurchased":
                    comparison = a[sortConfig.key] - b[sortConfig.key];
                    break;
                default:
                    comparison = a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            }
            return sortConfig.direction === "asc" ? comparison : -comparison;
        });

        return filtered;
    }, [data.data, timeFilter, searchQuery, sortConfig]);

    const handleSort = (key: keyof Transaction) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    return (
        <div className="space-y-6">
            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {formatCurrency(data.summary.totalRevenue)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Total Revenue
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {data.summary.totalCount}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Total Transactions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {formatCurrency(data.summary.averageValue)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Average Transaction Value
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Last 24 Hours
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">
                                        {formatCurrency(
                                            timeBasedMetrics.last24Hours.revenue
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>
                                    {timeBasedMetrics.last24Hours.count}{" "}
                                    transactions
                                </span>
                                <span>
                                    Avg:{" "}
                                    {formatCurrency(
                                        timeBasedMetrics.last24Hours.avgValue
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
                                    Last 7 Days
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">
                                        {formatCurrency(
                                            timeBasedMetrics.last7Days.revenue
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>
                                    {timeBasedMetrics.last7Days.count}{" "}
                                    transactions
                                </span>
                                <span>
                                    Avg:{" "}
                                    {formatCurrency(
                                        timeBasedMetrics.last7Days.avgValue
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
                                    Last 30 Days
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">
                                        {formatCurrency(
                                            timeBasedMetrics.last30Days.revenue
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>
                                    {timeBasedMetrics.last30Days.count}{" "}
                                    transactions
                                </span>
                                <span>
                                    Avg:{" "}
                                    {formatCurrency(
                                        timeBasedMetrics.last30Days.avgValue
                                    )}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by transaction ID, user, or product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Time period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Time</SelectItem>
                        <SelectItem value="24H">Last 24 Hours</SelectItem>
                        <SelectItem value="7D">Last 7 Days</SelectItem>
                        <SelectItem value="30D">Last 30 Days</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Transactions Table */}
            <div className="rounded-md border">
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
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Product ID</TableHead>
                            <TableHead
                                className="text-right cursor-pointer"
                                onClick={() => handleSort("qtyPurchased")}
                            >
                                Quantity{" "}
                                {sortConfig.key === "qtyPurchased" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </TableHead>
                            <TableHead
                                className="text-right cursor-pointer"
                                onClick={() => handleSort("totalPrice")}
                            >
                                Total Price{" "}
                                {sortConfig.key === "totalPrice" &&
                                    (sortConfig.direction === "asc"
                                        ? "↑"
                                        : "↓")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedTransactions.map((transaction) => (
                            <TableRow key={transaction.transactionId}>
                                <TableCell className="whitespace-nowrap">
                                    {formatDate(transaction.datetime)}
                                </TableCell>
                                <TableCell>
                                    {transaction.transactionId}
                                </TableCell>
                                <TableCell>{transaction.userId}</TableCell>
                                <TableCell>{transaction.productId}</TableCell>
                                <TableCell className="text-right">
                                    {transaction.qtyPurchased}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(transaction.totalPrice)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredAndSortedTransactions.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-4"
                                >
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default TransactionReport;
