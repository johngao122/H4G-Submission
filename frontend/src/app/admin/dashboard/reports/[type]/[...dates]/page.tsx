"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ReportContent } from "@/components/reports/reportContent";
import TopBarAdmin from "@/components/topbarAdmin";
import { Loader2 } from "lucide-react"; // Import for loading spinner

// Sample data - replace with API call
const SAMPLE_DATA = {
    audit: {
        metadata: {
            startDate: "2024-01-01",
            endDate: "2024-01-15",
            generatedAt: new Date().toISOString(),
        },
        logs: [
            {
                logId: "L2",
                userId: "U2",
                productId: "P2",
                datetime: "2025-01-14T16:15:24.743",
                action: "CREATE:Product [productId=P2, name=Shoelaces, category=Apparel, desc=null, price=10.0, quantity=50, productPhoto=[]]",
            },
        ],
        summary: {
            totalLogs: 1,
            uniqueUsers: 1,
            uniqueProducts: 1,
        },
    },
    request: {
        metadata: {
            startDate: "2024-01-01",
            endDate: "2024-01-15",
            generatedAt: new Date().toISOString(),
        },
        requests: [
            {
                requestId: "R3",
                userId: "U3",
                productName: "toothpaste",
                productDescription: "travel-sized Darlie toothpaste",
                createdOn: "2025-01-15T05:26:37.998624965",
            },
        ],
        summary: {
            totalRequests: 1,
            uniqueUsers: 1,
        },
    },
};

export default function ReportPage() {
    const params = useParams();
    const reportType = params.type as "audit" | "request";
    const startDate = params.dates?.[0] as string;
    const endDate = params.dates?.[1] as string;

    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

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
                    <div className="text-center text-red-500 space-y-2">
                        <p className="font-semibold">Error Loading Report</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            );
        }

        return (
            <ReportContent
                reportType={reportType}
                startDate={startDate}
                endDate={endDate}
                data={SAMPLE_DATA[reportType]}
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
