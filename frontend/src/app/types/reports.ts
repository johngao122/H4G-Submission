export type ReportType =
    | "audit"
    | "request"
    | "preorder"
    | "task"
    | "transaction";

export interface ReportData<T, S> {
    metadata: {
        startDate: string;
        endDate: string;
        generatedAt: string;
    };
    data: T[];
    summary: S;
}

export interface AuditLog {
    logId: string;
    userId: string;
    productId: string;
    datetime: string;
    action: string;
}

export interface AuditLogSummary {
    totalCount: number;
    uniqueUsers: number;
    uniqueProducts: number;
    actionTypes: Array<[string, number]>;
}

export interface ProductRequest {
    requestId: string;
    userId: string;
    productName: string;
    productDescription: string;
    datetime: string;
}

export interface ProductRequestSummary {
    totalCount: number;
    uniqueUsers: number;
}

export interface Preorder {
    preorderId: string;
    userId: string;
    productId: string;
    qtyPreordered: number;
    totalPrice: number;
    datetime: string;
    status: "PENDING" | "FULFILLED";
}

export interface PreorderSummary {
    totalCount: number;
    uniqueUsers: number;
    totalValue: number;
    averageValue: number;
    statusBreakdown: {
        pending: number;
        fulfilled: number;
    };
}

export interface TaskContributor {
    taskId: string;
    userId: string;
    contributorName: string;
    datetime: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
}

export interface Task {
    taskId: string;
    taskName: string;
    taskDesc: string;
    taskReward: number;
    datetime: string;
    contributors: TaskContributor[];
    status: "OPEN" | "CLOSED";
}

export interface TaskSummary {
    totalCount: number;
    uniqueUsers: number;
    totalRewards: number;
    averageReward: number;
    statusBreakdown: {
        open: number;
        closed: number;
    };
    uniqueContributors: number;
}

export interface Transaction {
    transactionId: string;
    userId: string;
    productId: string;
    qtyPurchased: number;
    totalPrice: number;
    datetime: string;
}

export interface TransactionSummary {
    totalCount: number;
    uniqueUsers: number;
    totalRevenue: number;
    averageValue: number;
    uniqueProducts: number;
    totalQuantity: number;
}

export type AuditLogReportData = ReportData<AuditLog, AuditLogSummary>;
export type ProductRequestReportData = ReportData<
    ProductRequest,
    ProductRequestSummary
>;
export type PreorderReportData = ReportData<Preorder, PreorderSummary>;
export type TaskReportData = ReportData<Task, TaskSummary>;
export type TransactionReportData = ReportData<Transaction, TransactionSummary>;

export type ReportDataType =
    | AuditLogReportData
    | ProductRequestReportData
    | PreorderReportData
    | TaskReportData
    | TransactionReportData;

export interface ReportContentProps {
    reportType: ReportType;
    startDate: string;
    endDate: string;
    data: ReportDataType | null;
}

export interface AuditLogReportProps {
    data: AuditLogReportData;
}

export interface ProductRequestReportProps {
    data: ProductRequestReportData;
}

export interface PreorderReportProps {
    data: PreorderReportData;
}

export interface TaskReportProps {
    data: TaskReportData;
}

export interface TransactionReportProps {
    data: TransactionReportData;
}

export const API_ENDPOINTS: Record<ReportType, string> = {
    preorder: "preorders/timeframe",
    audit: "product-logs/timeframe",
    request: "product-requests/timeframe",
    task: "tasks/timeframe",
    transaction: "transactions/timeframe",
} as const;

export function isAuditLogReport(
    reportType: ReportType,
    data: ReportDataType
): data is ReportData<AuditLog, AuditLogSummary> {
    return reportType === "audit";
}

export function isProductRequestReport(
    reportType: ReportType,
    data: ReportDataType
): data is ReportData<ProductRequest, ProductRequestSummary> {
    return reportType === "request";
}

export function isPreorderReport(
    reportType: ReportType,
    data: ReportDataType
): data is ReportData<Preorder, PreorderSummary> {
    return reportType === "preorder";
}

export function isTaskReport(
    reportType: ReportType,
    data: ReportDataType
): data is ReportData<Task, TaskSummary> {
    return reportType === "task";
}

export function isTransactionReport(
    reportType: ReportType,
    data: ReportDataType
): data is ReportData<Transaction, TransactionSummary> {
    return reportType === "transaction";
}
