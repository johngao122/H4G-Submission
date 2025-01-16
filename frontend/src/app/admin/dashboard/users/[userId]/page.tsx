"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserData {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumbers: string[];
    publicMetadata: {
        role: "admin" | "resident";
        voucherBalance?: number;
        suspended?: boolean;
    };
}

interface DatabaseUserData {
    userId: string;
    name: string;
    role: string;
    voucherBal: number;
    status: string;
}

export default function EditUserPage() {
    const { userId } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [dbUserData, setDbUserData] = useState<DatabaseUserData | null>(null);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        voucherBalance: "0",
        suspended: false,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch from Clerk
                const clerkResponse = await fetch(`/api/users/${userId}`);
                if (!clerkResponse.ok)
                    throw new Error("Failed to fetch user from Clerk");
                const clerkData = await clerkResponse.json();

                // Fetch from database
                const dbResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/users/${userId}`
                );
                if (!dbResponse.ok)
                    throw new Error("Failed to fetch user from database");
                const dbData = await dbResponse.json();

                setUserData(clerkData);
                setDbUserData(dbData);

                setFormData({
                    username: clerkData.username || "",
                    password: "",
                    firstName: clerkData.firstName || "",
                    lastName: clerkData.lastName || "",
                    phoneNumber: clerkData.phoneNumbers?.[0] || "",
                    role: dbData.role.toLowerCase() || "resident",
                    voucherBalance: dbData.voucherBal?.toString() || "0",
                    suspended: clerkData.publicMetadata.suspended || false,
                });
            } catch (error) {
                console.error("Error fetching user:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch user data",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Update Clerk metadata
            const metadataResponse = await fetch("/api/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    action: "UPDATE_METADATA",
                    data: {
                        role: formData.role,
                        suspended: formData.suspended,
                        voucherBalance:
                            formData.role === "resident"
                                ? parseFloat(formData.voucherBalance)
                                : 0,
                    },
                }),
            });

            if (!metadataResponse.ok) {
                throw new Error("Failed to update user metadata in Clerk");
            }

            // Update Clerk user info
            const userUpdateResponse = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    password: formData.password || undefined,
                    phoneNumber: formData.phoneNumber,
                }),
            });

            if (!userUpdateResponse.ok) {
                throw new Error("Failed to update user information in Clerk");
            }

            // Update database
            const dbUpdateResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/users/${userId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId,
                        name: `${formData.firstName} ${formData.lastName}`.trim(),
                        role: formData.role.toUpperCase(),
                        voucherBal:
                            formData.role === "resident"
                                ? parseFloat(formData.voucherBalance)
                                : 0,
                        status: formData.suspended ? "SUSPENDED" : "ACTIVE",
                    }),
                }
            );

            if (!dbUpdateResponse.ok) {
                throw new Error("Failed to update user in database");
            }

            toast({
                title: "Success",
                description: "User updated successfully",
            });

            router.push("/admin/dashboard/users");
            router.refresh();
        } catch (error) {
            console.error("Error updating user:", error);
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to update user",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit User</CardTitle>
                    <CardDescription>
                        Update user information and account settings
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                firstName: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                lastName: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            username: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    New Password (leave blank to keep current)
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    disabled
                                    className="bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            role: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="resident">
                                            Resident
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.role === "resident" && (
                                <div className="space-y-2">
                                    <Label htmlFor="voucherBalance">
                                        Voucher Balance
                                    </Label>
                                    <Input
                                        id="voucherBalance"
                                        type="number"
                                        step="0.01"
                                        value={formData.voucherBalance}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                voucherBalance: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="suspended"
                                    checked={formData.suspended}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            suspended: checked,
                                        }))
                                    }
                                />
                                <Label htmlFor="suspended">
                                    Account Suspended
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
