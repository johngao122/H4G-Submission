"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import type { Task } from "@/app/types/task";

interface CreateTaskForm {
    name: string;
    description: string;
    reward: string;
}

const CreateTaskPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateTaskForm>({
        name: "",
        description: "",
        reward: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.name.trim()) {
                throw new Error("Task name is required");
            }
            if (!formData.description.trim()) {
                throw new Error("Task description is required");
            }

            const reward = parseFloat(formData.reward);
            if (isNaN(reward) || reward <= 0) {
                throw new Error("Reward must be greater than 0");
            }

            const newTask: Partial<Task> = {
                name: formData.name,
                description: formData.description,
                reward: reward,
                status: "OPEN",
                contributors: [],
            };

            // TODO: Replace with actual API call
            console.log("Creating new task:", newTask);

            toast({
                title: "Success",
                description: "Task created successfully",
            });

            router.push("/admin/dashboard/tasks");
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to create task",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="container mx-auto p-4">
            <Button
                variant="ghost"
                className="mb-4"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                    <CardDescription>
                        Create a new task for residents to complete
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Task Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter task name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter task description"
                                required
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reward">Reward Amount ($)</Label>
                            <Input
                                id="reward"
                                name="reward"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.reward}
                                onChange={handleChange}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {isSubmitting ? "Creating..." : "Create Task"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateTaskPage;
