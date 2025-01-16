"use client";

import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuditLogReport } from "./auditLogReport";
import { ProductRequestReport } from "./productRequestReport";
import { PreorderReport } from "./preOrderReport";
import { TransactionReport } from "./transactionReport";
import {
    ReportContentProps,
    ReportType,
    ReportDataType,
    isAuditLogReport,
    isProductRequestReport,
    isPreorderReport,
    isTaskReport,
    isTransactionReport,
} from "@/app/types/reports";

export function ReportContent({
    reportType,
    startDate,
    endDate,
    data,
}: ReportContentProps) {
    const formatDate = (date: string) => {
        return format(new Date(date), "PPP");
    };

    const renderReport = () => {
        if (!data) {
            return (
                <Alert>
                    <AlertDescription>
                        No data available for the selected time period.
                    </AlertDescription>
                </Alert>
            );
        }

        switch (reportType) {
            case "audit":
                if (isAuditLogReport(reportType, data)) {
                    return <AuditLogReport data={data} />;
                }
                break;
            case "request":
                if (isProductRequestReport(reportType, data)) {
                    return <ProductRequestReport data={data} />;
                }
                break;
            case "preorder":
                if (isPreorderReport(reportType, data)) {
                    return <PreorderReport data={data} />;
                }
                break;
            case "transaction":
                if (isTransactionReport(reportType, data)) {
                    return <TransactionReport data={data} />;
                }
                break;
        }

        return (
            <Alert>
                <AlertDescription>Invalid report data format.</AlertDescription>
            </Alert>
        );
    };

    const getReportTitle = () => {
        const titles = {
            audit: "Audit Log Report",
            request: "Product Request Report",
            preorder: "Preorder Report",
            task: "Task Report",
            transaction: "Transaction Report",
        };

        return titles[reportType] || "Report";
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">
                    {getReportTitle()}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {startDate && endDate
                        ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                        : "Select date range"}
                </p>
            </CardHeader>
            <CardContent>{renderReport()}</CardContent>
        </Card>
    );
}
