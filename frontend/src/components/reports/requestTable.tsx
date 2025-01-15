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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface ProductRequest {
    requestId: string;
    userId: string;
    productName: string;
    productDescription: string;
    createdOn: string;
}

interface RequestTableProps {
    requests: ProductRequest[];
}

export function RequestTable({ requests }: RequestTableProps) {
    const [selectedRequest, setSelectedRequest] =
        React.useState<ProductRequest | null>(null);

    return (
        <>
            <Card className="mt-6">
                <CardContent className="p-0">
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        Request ID
                                    </TableHead>
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">
                                        Created On
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow
                                        key={request.requestId}
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                            setSelectedRequest(request)
                                        }
                                    >
                                        <TableCell className="font-medium">
                                            {request.requestId}
                                        </TableCell>
                                        <TableCell>{request.userId}</TableCell>
                                        <TableCell>
                                            {request.productName}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger className="text-left">
                                                    <span className="text-muted-foreground">
                                                        {request
                                                            .productDescription
                                                            .length > 50
                                                            ? `${request.productDescription.substring(
                                                                  0,
                                                                  50
                                                              )}...`
                                                            : request.productDescription}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-[300px] whitespace-normal">
                                                        {
                                                            request.productDescription
                                                        }
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {format(
                                                new Date(request.createdOn),
                                                "PPP p"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {requests.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No product requests found for the
                                            selected period
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TooltipProvider>
                </CardContent>
            </Card>

            <Dialog
                open={!!selectedRequest}
                onOpenChange={() => setSelectedRequest(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Product Request Details</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-6">
                            {/* Request Metadata */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Request ID
                                    </p>
                                    <p className="font-medium">
                                        {selectedRequest.requestId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        User ID
                                    </p>
                                    <p className="font-medium">
                                        {selectedRequest.userId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Created On
                                    </p>
                                    <p className="font-medium">
                                        {format(
                                            new Date(selectedRequest.createdOn),
                                            "PPP p"
                                        )}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Product Details */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Product Details
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Product Name
                                        </p>
                                        <p className="font-medium">
                                            {selectedRequest.productName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Description
                                        </p>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {selectedRequest.productDescription}
                                        </p>
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
