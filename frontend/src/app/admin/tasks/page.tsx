"use client";

import React, { useState, useEffect } from "react";
import TopBarAdmin from "@/components/topbarAdmin";
import TaskTableAdmin from "@/components/taskTable";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminTasksPage = () => {
    const router = useRouter();
    const { isSignedIn, user, isLoaded } = useUser();
    const { isAuthorized, isChecking, AccessDenied } = useAdminAuth();

    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/admin/login");
        }
    }, [isLoaded, user, router]);

    if (!isLoaded || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (!isAuthorized) {
        return <AccessDenied />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <main className="pt-4">
                <TaskTableAdmin />
            </main>
        </div>
    );
};

export default AdminTasksPage;
