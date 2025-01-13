interface TransactionItem {
    productId: string;
    quantity: number;
    pricePerUnit: number;
}

interface Transaction {
    transactionId: string;
    userId: string;
    items: TransactionItem[];
    totalPrice: number;
    datetime: string;
}

interface TransactionResponse {
    success: boolean;
    transactionId: string;
    error?: string;
}

interface TransactionRequest {
    userId: string;
    items: TransactionItem[];
    totalPrice: number;
    datetime: string;
}

export type {
    Transaction,
    TransactionItem,
    TransactionResponse,
    TransactionRequest,
};
