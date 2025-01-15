"use client";

import React from "react";
import TopBar from "@/components/topbar";
import TransactionHistoryTable from "@/components/transactionHistoryTable";
import { Card } from "@/components/ui/card";

const TransactionHistoryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Transaction History
                    </h1>
                    <p className="text-gray-600 mt-2">
                        View and track all your past transactions
                    </p>
                </div>

                <div className="space-y-6">
                    <Card className="p-4 bg-white shadow-sm">
                        <div className="text-sm text-gray-500">
                            <p>
                                • Click on any transaction to view detailed
                                information
                            </p>
                            <p>
                                • Use the search bar to filter transactions by
                                ID
                            </p>
                            <p>• Click column headers to sort the data</p>
                        </div>
                    </Card>

                    <TransactionHistoryTable />
                </div>
            </div>
        </div>
    );
};

export default TransactionHistoryPage;
