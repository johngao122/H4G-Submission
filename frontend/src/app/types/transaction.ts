interface TransactionItem {
    productId: string;
    quantity: number;
    pricePerUnit: number;
}

interface TransactionItemInTable extends TransactionItem {
    productName: string;
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

interface TransactionDisplay {
    transactionId: string;
    userId: string;
    items: TransactionItemInTable[];
    totalPrice: number;
    datetime: string;
}

interface TransactionHistoryProps {
    transactions: TransactionDisplay[];
}

export type {
    Transaction,
    TransactionItem,
    TransactionResponse,
    TransactionRequest,
    TransactionDisplay,
    TransactionHistoryProps,
};
