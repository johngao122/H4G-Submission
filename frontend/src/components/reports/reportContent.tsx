"use client";

import React from "react";
import { ReportHeader } from "./reportHeader";
import { ReportSummary } from "./reportSummary";
import { AuditTable } from "./auditTable";
import { RequestTable } from "./requestTable";

// Types for the audit log report
interface AuditLog {
    logId: string;
    userId: string;
    productId: string;
    datetime: string;
    action: string;
}

interface AuditLogReport {
    metadata: {
        startDate: string;
        endDate: string;
        generatedAt: string;
    };
    logs: AuditLog[];
    summary: {
        totalLogs: number;
        uniqueUsers: number;
        uniqueProducts: number;
    };
}

// Types for the request report
interface ProductRequest {
    requestId: string;
    userId: string;
    productName: string;
    productDescription: string;
    createdOn: string;
}

interface RequestReport {
    metadata: {
        startDate: string;
        endDate: string;
        generatedAt: string;
    };
    requests: ProductRequest[];
    summary: {
        totalRequests: number;
        uniqueUsers: number;
    };
}

interface ReportContentProps {
    reportType: "audit" | "request";
    startDate: string;
    endDate: string;
    data: AuditLogReport | RequestReport;
}

export function ReportContent({
    reportType,
    startDate,
    endDate,
    data,
}: ReportContentProps) {
    const renderContent = () => {
        if (reportType === "audit") {
            const auditData = data as AuditLogReport;
            return (
                <>
                    <ReportSummary
                        reportType="audit"
                        data={{
                            totalLogs: auditData.summary.totalLogs,
                            uniqueUsers: auditData.summary.uniqueUsers,
                            uniqueProducts: auditData.summary.uniqueProducts,
                        }}
                    />
                    <AuditTable logs={auditData.logs} />
                </>
            );
        } else {
            const requestData = data as RequestReport;
            return (
                <>
                    <ReportSummary
                        reportType="request"
                        data={{
                            totalRequests: requestData.summary.totalRequests,
                            uniqueUsers: requestData.summary.uniqueUsers,
                        }}
                    />
                    <RequestTable requests={requestData.requests} />
                </>
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
                <ReportHeader
                    reportType={reportType}
                    startDate={startDate}
                    endDate={endDate}
                    generatedAt={data.metadata.generatedAt}
                />
                {renderContent()}
            </div>
        </div>
    );
}
