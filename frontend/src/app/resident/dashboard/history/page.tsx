"use client";

import React from "react";
import TopBar from "@/components/topbar";
import TransactionHistoryTable from "@/components/transactionHistoryTable";
import type { TransactionDisplay } from "@/app/types/transaction";

const sampleTransactions: TransactionDisplay[] = [
    {
        transactionId: "TRX-001",
        userId: "USER-001",
        items: [
            {
                productId: "1",
                productName: "Product 1",
                quantity: 2,
                pricePerUnit: 19.99,
            },
            {
                productId: "2",
                productName: "Product 2",
                quantity: 1,
                pricePerUnit: 29.99,
            },
        ],
        totalPrice: 69.97,
        datetime: new Date(2025, 0, 10, 14, 30).toISOString(),
    },
    {
        transactionId: "TRX-002",
        userId: "USER-001",
        items: [
            {
                productId: "3",
                productName: "Product 3",
                quantity: 3,
                pricePerUnit: 39.99,
            },
        ],
        totalPrice: 119.97,
        datetime: new Date(2025, 0, 11, 9, 15).toISOString(),
    },
    {
        transactionId: "TRX-003",
        userId: "USER-002",
        items: [
            {
                productId: "1",
                productName: "Product 1",
                quantity: 1,
                pricePerUnit: 19.99,
            },
        ],
        totalPrice: 19.99,
        datetime: new Date(2025, 0, 12, 16, 45).toISOString(),
    },
];

const TransactionHistoryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <main className="pt-4">
                <TransactionHistoryTable transactions={sampleTransactions} />
            </main>
        </div>
    );
};

export default TransactionHistoryPage;
