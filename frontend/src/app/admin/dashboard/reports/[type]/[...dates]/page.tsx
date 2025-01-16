"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ReportContent } from "@/components/reports/reportContent";
import TopBarAdmin from "@/components/topbarAdmin";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDateForAPI, isValidDateRange } from "./helpers";

type ReportType = "audit" | "request" | "preorder" | "task" | "transaction";

interface TaskContributor {
    taskId: string;
    userId: string;
    contributorName: string;
    datetime: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
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

const API_ENDPOINTS = {
    preorder: "preorders/timeframe",
    audit: "product-logs/timeframe",
    request: "product-requests/timeframe",
    task: "tasks/timeframe",
    transaction: "transactions/timeframe",
} as const;

export default function ReportPage() {
    const params = useParams();
    const reportType = params.type as ReportType;
    const rawStartDate = params.dates?.[0] as string;
    const rawEndDate = params.dates?.[1] as string;

    const startDate = React.useMemo(
        () => formatDateForAPI(rawStartDate),
        [rawStartDate]
    );
    const endDate = React.useMemo(
        () => formatDateForAPI(rawEndDate),
        [rawEndDate]
    );

    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [data, setData] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchReport = async () => {
            if (!isValidDateRange(startDate, endDate)) {
                setError(
                    "Invalid date range: Start date must be before or equal to end date"
                );
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const endpoint = API_ENDPOINTS[reportType];
                if (!endpoint) {
                    throw new Error("Invalid report type");
                }

                const baseUrl = process.env.NEXT_PUBLIC_API;
                const url = `${baseUrl}/${endpoint}?start=${encodeURIComponent(
                    startDate
                )}&end=${encodeURIComponent(endDate)}`;

                console.log("Fetching report from:", url);

                const response = await fetch(url);

                if (!response.ok) {
                    if (response.status === 404) {
                        setData(null);
                        return;
                    }
                    throw new Error(
                        `Error fetching report: ${response.statusText}`
                    );
                }

                const reportData = await response.json();

                const transformedData = {
                    metadata: {
                        startDate,
                        endDate,
                        generatedAt: new Date().toISOString(),
                    },
                    data: reportData,
                    summary: calculateSummary(reportType, reportData),
                };

                console.log("Fetched report:", transformedData);

                setData(transformedData);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An error occurred while fetching the report"
                );
                console.error("Error fetching report:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (startDate && endDate && reportType) {
            fetchReport();
        }
    }, [reportType, startDate, endDate]);

    const calculateSummary = (type: ReportType, data: any[]) => {
        if (!Array.isArray(data))
            return { totalCount: 0, uniqueUsers: 0, startDate, endDate };

        const commonMetrics = {
            totalCount: data.length,
            uniqueUsers: new Set(data.map((item) => item.userId)).size,
        };

        switch (type) {
            case "audit":
                return {
                    ...commonMetrics,
                    uniqueProducts: new Set(data.map((log) => log.productId))
                        .size,
                    actionTypes: Object.entries(
                        data.reduce((acc, log) => {
                            acc[log.action] = (acc[log.action] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)
                    ),
                };

            case "request":
                return {
                    ...commonMetrics,
                    statusBreakdown: Object.entries(
                        data.reduce((acc, req) => {
                            acc[req.status] = (acc[req.status] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)
                    ),
                };

            case "preorder":
                return {
                    ...commonMetrics,
                    totalValue: data.reduce(
                        (sum, po) => sum + po.totalPrice,
                        0
                    ),
                    averageValue:
                        data.length > 0
                            ? data.reduce((sum, po) => sum + po.totalPrice, 0) /
                              data.length
                            : 0,
                    statusBreakdown: {
                        pending: data.filter((po) => po.status === "PENDING")
                            .length,
                        fulfilled: data.filter(
                            (po) => po.status === "FULFILLED"
                        ).length,
                    },
                };

            case "task":
                const tasks = data as Task[];
                return {
                    ...commonMetrics,
                    totalRewards: tasks.reduce(
                        (sum, task) => sum + task.taskReward,
                        0
                    ),
                    averageReward:
                        tasks.length > 0
                            ? tasks.reduce(
                                  (sum, task) => sum + task.taskReward,
                                  0
                              ) / tasks.length
                            : 0,
                    statusBreakdown: {
                        open: tasks.filter((task) => task.status === "OPEN")
                            .length,
                        closed: tasks.filter((task) => task.status === "CLOSED")
                            .length,
                    },
                    uniqueContributors: new Set(
                        tasks.flatMap((task) =>
                            task.contributors.map((c) => c.userId)
                        )
                    ).size,
                };

            case "transaction":
                return {
                    ...commonMetrics,
                    totalRevenue: data.reduce(
                        (sum, tx) => sum + tx.totalPrice,
                        0
                    ),
                    averageValue:
                        data.length > 0
                            ? data.reduce((sum, tx) => sum + tx.totalPrice, 0) /
                              data.length
                            : 0,
                    uniqueProducts: new Set(data.map((tx) => tx.productId))
                        .size,
                    totalQuantity: data.reduce(
                        (sum, tx) => sum + tx.qtyPurchased,
                        0
                    ),
                };

            default:
                return commonMetrics;
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto" />
                        <p className="text-muted-foreground">
                            Loading report data...
                        </p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            );
        }

        return (
            <ReportContent
                reportType={reportType}
                startDate={startDate}
                endDate={endDate}
                data={data}
            />
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <div className="container mx-auto px-4 py-8">{renderContent()}</div>
        </div>
    );
}
