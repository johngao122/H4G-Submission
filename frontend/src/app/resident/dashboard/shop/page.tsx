"use client";

import React from "react";
import TopBar from "@/components/topbar";
import Shop from "@/components/shop";
import Link from "next/link";

const ShopPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 relative pb-16">
            <TopBar />
            <Shop />
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <Link
                        href="/resident/dashboard/request"
                        className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Want to request an item? Click here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
