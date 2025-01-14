"use client";

import React from "react";
import { useCheckSuspended } from "@/hooks/useSuspended";
import { Loader2 } from "lucide-react";

export function withSuspendedCheck(Component: React.ComponentType<any>) {
    return function ProtectedComponent(props: any) {
        const { isLoaded } = useCheckSuspended();

        if (!isLoaded) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            );
        }

        return <Component {...props} />;
    };
}
