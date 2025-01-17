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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProductRequest, ProductRequestReportProps } from "@/app/types/reports";

export function ProductRequestReport({ data }: ProductRequestReportProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof ProductRequest;
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

    const timeBasedStats = React.useMemo(() => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(
            now.getTime() - 24 * 60 * 60 * 1000
        );
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        return {
            last24Hours: data.data.filter(
                (request: ProductRequest) =>
                    new Date(request.datetime) > twentyFourHoursAgo
            ).length,
            lastSevenDays: data.data.filter(
                (request: ProductRequest) =>
                    new Date(request.datetime) > sevenDaysAgo
            ).length,
        };
    }, [data.data]);

    const filteredAndSortedRequests = React.useMemo(() => {
        let filtered = [...data.data];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (request: ProductRequest) =>
                    request.userId.toLowerCase().includes(query) ||
                    request.productName.toLowerCase().includes(query) ||
                    request.productDescription.toLowerCase().includes(query)
            );
        }

        filtered.sort((a: ProductRequest, b: ProductRequest) => {
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
    }, [data.data, searchQuery, sortConfig]);

    const handleSort = (key: keyof ProductRequest) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const MobileRequestCard = ({ request }: { request: ProductRequest }) => (
        <Card className="mb-4">
            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="font-medium">{request.productName}</div>
                        <span className="text-sm text-gray-500">
                            {formatDate(request.datetime)}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <span className="text-sm font-medium">
                                Request ID:{" "}
                            </span>
                            <span className="text-sm font-mono break-all">
                                {request.requestId}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium">
                                User ID:{" "}
                            </span>
                            <span className="text-sm font-mono break-all">
                                {request.userId}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 border-t">
                        <div className="text-sm text-gray-600">
                            {request.productDescription}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {data.summary.totalCount}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Total Requests
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
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {data.data.length}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Unique Products
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {timeBasedStats.last24Hours}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Last 24 Hours
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-xl md:text-2xl font-bold">
                            {timeBasedStats.lastSevenDays}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Last 7 Days
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder={
                            isMobile
                                ? "Search requests..."
                                : "Search by user, product name, or description..."
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {isMobile ? (
                <div className="space-y-4">
                    {filteredAndSortedRequests.map((request) => (
                        <MobileRequestCard
                            key={request.requestId}
                            request={request}
                        />
                    ))}
                    {filteredAndSortedRequests.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No requests found</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer whitespace-nowrap"
                                    onClick={() => handleSort("datetime")}
                                >
                                    Date & Time{" "}
                                    {sortConfig.key === "datetime" &&
                                        (sortConfig.direction === "asc"
                                            ? "↑"
                                            : "↓")}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer whitespace-nowrap"
                                    onClick={() => handleSort("userId")}
                                >
                                    User ID{" "}
                                    {sortConfig.key === "userId" &&
                                        (sortConfig.direction === "asc"
                                            ? "↑"
                                            : "↓")}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer whitespace-nowrap"
                                    onClick={() => handleSort("productName")}
                                >
                                    Product Name{" "}
                                    {sortConfig.key === "productName" &&
                                        (sortConfig.direction === "asc"
                                            ? "↑"
                                            : "↓")}
                                </TableHead>
                                <TableHead className="whitespace-nowrap">
                                    Description
                                </TableHead>
                                <TableHead className="whitespace-nowrap">
                                    Request ID
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedRequests.map((request) => (
                                <TableRow key={request.requestId}>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDate(request.datetime)}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {request.userId}
                                    </TableCell>
                                    <TableCell>{request.productName}</TableCell>
                                    <TableCell className="max-w-md">
                                        <p
                                            className="truncate"
                                            title={request.productDescription}
                                        >
                                            {request.productDescription}
                                        </p>
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {request.requestId}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredAndSortedRequests.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-4"
                                    >
                                        No requests found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default ProductRequestReport;
