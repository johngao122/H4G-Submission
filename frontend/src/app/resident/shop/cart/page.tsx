"use client";

import React from "react";
import TopBar from "@/components/topbar";
import Cart from "@/components/cart";

const CartPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <Cart />
        </div>
    );
};

export default CartPage;
