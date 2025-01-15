"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AuditLog {
    logId: string;
    userId: string;
    productId: string;
    datetime: string;
    action: string;
}

interface ProductDetails {
    productId?: string;
    name?: string;
    category?: string;
    desc?: string;
    price?: string;
    quantity?: string;
    productPhoto?: string;
}

interface AuditTableProps {
    logs: AuditLog[];
}

export function AuditTable({ logs }: AuditTableProps) {
    const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);

    // Function to parse product details from action string
    const parseProductDetails = (action: string): ProductDetails => {
        const detailsMatch = action.match(/\[(.*?)\]/);
        if (!detailsMatch) return {};

        const details: ProductDetails = {};
        detailsMatch[1].split(",").forEach((pair) => {
            const [key, value] = pair.split("=").map((s) => s.trim());
            details[key as keyof ProductDetails] =
                value === "null" ? undefined : value;
        });

        return details;
    };

    // Function to create readable action message
    const formatActionMessage = (action: string): string => {
        const actionType = action.split(":")[0];
        const details = parseProductDetails(action);

        if (!details.name) return action;

        switch (actionType) {
            case "CREATE":
                return `Created product "${details.name}"${
                    details.quantity ? ` with quantity ${details.quantity}` : ""
                }`;
            case "UPDATE":
                return `Updated product "${details.name}"`;
            case "DELETE":
                return `Deleted product "${details.name}"`;
            default:
                return `${actionType} performed on product "${details.name}"`;
        }
    };

    // Function to create detailed action summary
    const createDetailedSummary = (action: string) => {
        const details = parseProductDetails(action);

        return [
            { label: "Product Name", value: details.name || "N/A" },
            { label: "Category", value: details.category || "N/A" },
            {
                label: "Price",
                value: details.price ? `$${details.price}` : "N/A",
            },
            { label: "Quantity", value: details.quantity || "N/A" },
            { label: "Description", value: details.desc || "N/A" },
        ];
    };

    return (
        <>
            <Card className="mt-6">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Log ID
                                </TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Product ID</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead className="text-right">
                                    Date & Time
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow
                                    key={log.logId}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <TableCell className="font-medium">
                                        {log.logId}
                                    </TableCell>
                                    <TableCell>{log.userId}</TableCell>
                                    <TableCell>{log.productId}</TableCell>
                                    <TableCell>
                                        {formatActionMessage(log.action)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {format(
                                            new Date(log.datetime),
                                            "PPP p"
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No audit logs found for the selected
                                        period
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog
                open={!!selectedLog}
                onOpenChange={() => setSelectedLog(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Audit Log Details</DialogTitle>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Log ID
                                    </p>
                                    <p className="font-medium">
                                        {selectedLog.logId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        User ID
                                    </p>
                                    <p className="font-medium">
                                        {selectedLog.userId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Product ID
                                    </p>
                                    <p className="font-medium">
                                        {selectedLog.productId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Timestamp
                                    </p>
                                    <p className="font-medium">
                                        {format(
                                            new Date(selectedLog.datetime),
                                            "PPP p"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Action Summary
                                </p>
                                <p className="font-medium mb-4">
                                    {formatActionMessage(selectedLog.action)}
                                </p>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium mb-3">
                                        Product Details:
                                    </p>
                                    <div className="space-y-2">
                                        {createDetailedSummary(
                                            selectedLog.action
                                        ).map((detail, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-2 gap-2"
                                            >
                                                <p className="text-sm text-muted-foreground">
                                                    {detail.label}
                                                </p>
                                                <p className="text-sm">
                                                    {detail.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
