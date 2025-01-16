"use client";

import React from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import TopBarAdmin from "@/components/topbarAdmin";
import { Loader2 } from "lucide-react";
import { withSuspendedCheck } from "@/components/useCheckSuspended";

interface AdminLayoutProps {
    children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
    const { isAuthorized, isChecking, AccessDenied, userInfo } = useAdminAuth();

    if (isChecking) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return <AccessDenied />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    );
}

export default withSuspendedCheck(AdminLayout);
