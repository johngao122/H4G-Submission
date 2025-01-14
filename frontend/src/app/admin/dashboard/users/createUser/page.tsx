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

const AddUserForm = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        role: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            role: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validation
            if (!formData.name.trim() || !formData.role) {
                toast({
                    title: "Error",
                    description: "Please fill in all required fields",
                    variant: "destructive",
                });
                return;
            }

            // TODO: Replace with actual API call
            console.log("Creating user:", formData);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "User has been created successfully",
            });
            setFormData({
                name: "",
                role: "",
            });
        } catch (error) {
            console.error("Error creating user:", error);
            toast({
                title: "Error",
                description: "Failed to create user. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
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
                                Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter user name"
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
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
        </div>
    );
};

export default AddUserForm;
