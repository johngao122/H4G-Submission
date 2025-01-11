"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ForgotPasswordPage = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        router.push("/admin/dashboard");
    }

    async function create(e: React.FormEvent) {
        e.preventDefault();
        await signIn
            ?.create({
                strategy: "reset_password_phone_code",
                identifier: phoneNumber,
            })
            .then((_) => {
                setSuccessfulCreation(true);
                setError("");
            })
            .catch((err) => {
                setError(err.errors[0].longMessage);
            });
    }

    async function reset(e: React.FormEvent) {
        e.preventDefault();
        await signIn
            ?.attemptFirstFactor({
                strategy: "reset_password_phone_code",
                code,
                password,
            })
            .then((result) => {
                if (result.status === "needs_second_factor") {
                    setSecondFactor(true);
                    setError("");
                } else if (result.status === "complete") {
                    setActive({ session: result.createdSessionId });
                    router.push("/admin/dashboard");
                }
            })
            .catch((err) => {
                console.error("error", err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
            });
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Reset Password
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form
                        className="space-y-4"
                        onSubmit={!successfulCreation ? create : reset}
                    >
                        {!successfulCreation ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+65 1234 5678"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Send Reset Code
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        New Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">
                                        Verification Code
                                    </Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        placeholder="Enter code sent to your phone"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Reset Password
                                </Button>
                            </div>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {secondFactor && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Two-factor authentication is required.
                                    Please contact support.
                                </AlertDescription>
                            </Alert>
                        )}
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <Link
                        href="/admin/login"
                        className="text-sm text-primary hover:text-primary/80"
                    >
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
