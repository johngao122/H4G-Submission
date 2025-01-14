"use client";

import React from "react";
import { useUser, SignOutButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCheckSuspended } from "@/hooks/useSuspended";
import { useRouter } from "next/navigation";

const SuspendedPage = () => {
    const { user, isLoaded } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const { isLoaded: isSuspendedChecked } = useCheckSuspended();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (!isLoaded || !isSuspendedChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-red-100">
                            <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-600">
                        Account Suspended
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">
                        Your account has been suspended. Please contact the
                        administrators for more information and assistance.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                            If you believe this is a mistake or need to discuss
                            your account status, please reach out to your
                            administrator.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                    <Button
                        variant="destructive"
                        className="w-full max-w-xs"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SuspendedPage;
