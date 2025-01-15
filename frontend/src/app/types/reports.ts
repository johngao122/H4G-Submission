export interface ReportMetadata {
    startDate: string;
    endDate: string;
    generatedAt: string;
    generatedBy: string;
    reportType: "inventory" | "audit";
}

export interface InventoryMovement {
    id: string;
    itemId: string;
    itemName: string;
    movementType: "IN" | "OUT";
    quantity: number;
    reason: string;
    timestamp: string;
    performedBy: string;
}

export interface InventoryStatus {
    id: string;
    name: string;
    currentQuantity: number;
    category: string;
    lastUpdated: string;
    minimumStock: number;
    maximumStock: number;
}

export interface AuditLogEntry {
    id: string;
    action: "CREATE" | "UPDATE" | "DELETE";
    itemId: string;
    itemName: string;
    changes: {
        field: string;
        oldValue: string;
        newValue: string;
    }[];
    userId: string;
    timestamp: string;
}

export interface InventoryReport {
    metadata: ReportMetadata;
    inventoryStatus: InventoryStatus[];
    movements: InventoryMovement[];
    summary: {
        totalItems: number;
        totalValue: number;
        lowStockItems: number;
        outOfStockItems: number;
        totalMovements: {
            in: number;
            out: number;
        };
    };
}

export interface AuditReport {
    metadata: ReportMetadata;
    entries: AuditLogEntry[];
    summary: {
        totalActions: number;
        actionsByType: {
            CREATE: number;
            UPDATE: number;
            DELETE: number;
        };
        mostModifiedItems: {
            itemId: string;
            itemName: string;
            modificationCount: number;
        }[];
    };
}

export interface ReportRequest {
    startDate: string;
    endDate: string;
    reportType: "inventory" | "audit";
    filters?: {
        categories?: string[];
        users?: string[];
        actions?: string[];
    };
}

export type ReportResponse = {
    success: boolean;
    data: InventoryReport | AuditReport;
    error?: string;
};
