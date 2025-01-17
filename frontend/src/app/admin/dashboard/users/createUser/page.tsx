"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import TopBarAdmin from "@/components/topbarAdmin";

interface FormData {
    name: string;
    phoneNumber: string;
    username: string;
    password: string;
    role: "admin" | "resident";
    voucherBal: number;
}

const AddUserForm = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState<FormData>({
        name: "",
        phoneNumber: "",
        username: "",
        password: "",
        role: "resident",
        voucherBal: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "voucherBal" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleRoleChange = (value: "admin" | "resident") => {
        setFormData((prev) => ({
            ...prev,
            role: value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            toast({
                title: "Error",
                description: "Please enter a name",
                variant: "destructive",
            });
            return false;
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(formData.username)) {
            toast({
                title: "Error",
                description:
                    "Username can only contain letters, numbers, and underscores",
                variant: "destructive",
            });
            return false;
        }

        const phoneRegex = /^\+65[689]\d{7}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            toast({
                title: "Error",
                description:
                    "Please enter a valid Singapore phone number (+658XXXXXXX or +659XXXXXXX)",
                variant: "destructive",
            });
            return false;
        }

        if (formData.password.length < 8) {
            toast({
                title: "Error",
                description: "Password must be at least 8 characters long",
                variant: "destructive",
            });
            return false;
        }

        if (formData.role === "resident" && formData.voucherBal < 0) {
            toast({
                title: "Error",
                description: "Voucher balance cannot be negative",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        const submitData = {
            ...formData,
            voucherBal:
                formData.role === "resident" ? Number(formData.voucherBal) : 0,
        };

        console.log("Submitting data:", submitData);

        try {
            const clerkResponse = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            const clerkData = await clerkResponse.json();

            if (!clerkResponse.ok) {
                throw new Error(
                    clerkData.error || "Failed to create user in Clerk"
                );
            }

            console.log("Clerk response:", clerkData);

            toast({
                title: "Success",
                description: `User has been created successfully${
                    formData.role === "resident"
                        ? ` with ${formData.voucherBal} voucher balance`
                        : ""
                }`,
            });

            setFormData({
                name: "",
                phoneNumber: "",
                username: "",
                password: "",
                role: "resident",
                voucherBal: 0,
            });

            router.push("/admin/dashboard/users");
            router.refresh();
        } catch (error) {
            console.error("Error creating user:", error);
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to create user",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <TopBarAdmin />
            <main className="mt-8">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Add New User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter username"
                                    className="w-full"
                                />
                                <p className="text-sm text-gray-500">
                                    Only letters, numbers, and underscores
                                    allowed
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="phoneNumber"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Phone Number
                                </label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="+6598765432"
                                    className="w-full"
                                />
                                <p className="text-sm text-gray-500">
                                    Format: +65XXXXXXXX
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password (min. 8 characters)"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="role"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Role
                                </label>
                                <Select
                                    value={formData.role}
                                    onValueChange={handleRoleChange}
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select user role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="resident">
                                            Resident
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.role === "resident" && (
                                <div className="space-y-2">
                                    <label
                                        htmlFor="voucherBal"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Initial Voucher Balance
                                    </label>
                                    <Input
                                        id="voucherBal"
                                        name="voucherBal"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            formData.voucherBal === 0
                                                ? ""
                                                : formData.voucherBal
                                        }
                                        onChange={handleInputChange}
                                        placeholder="Enter initial voucher balance"
                                        className="w-full"
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Create User"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default AddUserForm;
