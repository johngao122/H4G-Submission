"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCircle, ShieldCheck } from "lucide-react";
import "@/app/globals.css";

export default function Home() {
    const router = useRouter();

    const handleResidentLogin = () => {
        router.push("/resident/login");
    };

    const handleAdminLogin = () => {
        router.push("/admin/login");
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Muhammadiyah Welfare Home
                </h1>
                <p className="text-gray-600 text-lg">
                    Minimart & Voucher System
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
                <Card className="transform hover:scale-105 transition-transform duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2">
                            <UserCircle className="h-6 w-6" />
                            Resident Login
                        </CardTitle>
                        <CardDescription className="text-center">
                            Access your vouchers and make minimart requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button
                            size="lg"
                            className="w-full max-w-xs"
                            onClick={handleResidentLogin}
                        >
                            Login as Resident
                        </Button>
                    </CardContent>
                </Card>

                <Card className="transform hover:scale-105 transition-transform duration-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2">
                            <ShieldCheck className="h-6 w-6" />
                            Admin Login
                        </CardTitle>
                        <CardDescription className="text-center">
                            Manage inventory and approve requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="w-full max-w-xs"
                            onClick={handleAdminLogin}
                        >
                            Login as Admin
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <footer className="mt-12 text-center text-gray-600">
                <p>
                    &copy; 2025 Muhammadiyah Welfare Home. All rights reserved.
                </p>
            </footer>
        </main>
    );
}
