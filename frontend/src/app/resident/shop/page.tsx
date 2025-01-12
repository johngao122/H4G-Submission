"use client";

import React from "react";
import TopBar from "@/components/topbar";
import Shop from "@/components/shop";

const ShopPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <Shop />
        </div>
    );
};

export default ShopPage;
