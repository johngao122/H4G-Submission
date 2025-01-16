"use client";

import React from "react";
import AdminLayout from "@/components/adminLayout";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}
