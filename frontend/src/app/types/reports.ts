export interface AuditLog {
    logId: string;
    userId: string;
    productId: string;
    datetime: string;
    action: string;
}

export interface ProductRequest {
    requestId: string;
    userId: string;
    productName: string;
    productDescription: string;
    createdOn: string;
}

export interface ReportMetadata {
    startDate: string;
    endDate: string;
    generatedAt: string;
}

export interface ReportRequest {
    startDate: string;
    endDate: string;
    reportType: "audit" | "request";
}

export interface AuditLogReport {
    metadata: ReportMetadata;
    logs: AuditLog[];
    summary: {
        totalLogs: number;
        uniqueUsers: number;
        uniqueProducts: number;
    };
}

export interface RequestReport {
    metadata: ReportMetadata;
    requests: ProductRequest[];
    summary: {
        totalRequests: number;
        uniqueUsers: number;
    };
}

export type ReportResponse = {
    success: boolean;
    data: AuditLogReport | RequestReport;
    error?: string;
};

export interface ReportFilters {
    userId?: string;
    productId?: string;
    actionType?: string;
    status?: string;
}
