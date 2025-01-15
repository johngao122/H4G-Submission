"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Users, Package } from "lucide-react";

interface AuditSummaryProps {
    totalLogs: number;
    uniqueUsers: number;
    uniqueProducts: number;
}

interface RequestSummaryProps {
    totalRequests: number;
    uniqueUsers: number;
}

type ReportSummaryProps = {
    reportType: "audit" | "request";
    data: AuditSummaryProps | RequestSummaryProps;
};

export function ReportSummary({ reportType, data }: ReportSummaryProps) {
    const renderAuditSummary = (data: AuditSummaryProps) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Activity className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Logs
                            </p>
                            <p className="text-2xl font-bold">
                                {data.totalLogs}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-full">
                            <Users className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Unique Users
                            </p>
                            <p className="text-2xl font-bold">
                                {data.uniqueUsers}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-full">
                            <Package className="h-6 w-6 text-purple-700" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Unique Products
                            </p>
                            <p className="text-2xl font-bold">
                                {data.uniqueProducts}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderRequestSummary = (data: RequestSummaryProps) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Activity className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Requests
                            </p>
                            <p className="text-2xl font-bold">
                                {data.totalRequests}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-full">
                            <Users className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Unique Users
                            </p>
                            <p className="text-2xl font-bold">
                                {data.uniqueUsers}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="mt-6">
            {reportType === "audit"
                ? renderAuditSummary(data as AuditSummaryProps)
                : renderRequestSummary(data as RequestSummaryProps)}
        </div>
    );
}
