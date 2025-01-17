"use client";

import React, { useState, useEffect } from "react";
import TopBar from "@/components/topbar";
import { TaskCard } from "@/components/task";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contributor {
    taskId: string;
    userId: string;
    contributorName: string;
    datetime: string;
    status: "PENDING" | "FULFILLED" | "CANCELLED";
}

interface Task {
    taskId: string;
    taskName: string;
    taskDesc: string;
    taskReward: number;
    datetime: string;
    contributors: Contributor[];
    status: "OPEN" | "CLOSED";
}

const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "CLOSED">(
        "ALL"
    );
    const { toast } = useToast();

    const fetchTasks = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/tasks`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load tasks. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter((task) => {
        const matches =
            task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.taskDesc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "ALL" || task.status === statusFilter;
        return matches && matchesStatus;
    });

    const handleAcceptTask = (taskId: string) => {
        fetchTasks();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopBar />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-6">
                        Available Quests
                    </h1>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="w-full md:w-48">
                            <Select
                                value={statusFilter}
                                onValueChange={(
                                    value: "ALL" | "OPEN" | "CLOSED"
                                ) => setStatusFilter(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Quests
                                    </SelectItem>
                                    <SelectItem value="OPEN">
                                        Open Quests
                                    </SelectItem>
                                    <SelectItem value="CLOSED">
                                        Closed Quests
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.taskId}
                            task={task}
                            onAccept={handleAcceptTask}
                            refreshTasks={fetchTasks}
                        />
                    ))}

                    {filteredTasks.length === 0 && (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">
                                No quests found matching your criteria
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TaskPage;
