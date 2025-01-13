"use client";

import React, { useState } from "react";
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
import { Search, Filter } from "lucide-react";
import type { Task } from "@/app/types/task";

const SAMPLE_TASKS: Task[] = [
    //Replace with API
    {
        id: "1",
        name: "Clean Common Area",
        description:
            "Help clean and organize the common area including sweeping, dusting, and arranging furniture.",
        reward: 15.0,
        contributors: [
            { id: "1", name: "John Doe", imageUrl: "/api/placeholder/32/32" },
            { id: "2", name: "Jane Smith", imageUrl: "/api/placeholder/32/32" },
        ],
        status: "OPEN",
    },
    {
        id: "2",
        name: "Kitchen Assistance",
        description:
            "Assist in kitchen duties including meal preparation and cleaning.",
        reward: 20.0,
        contributors: [
            {
                id: "3",
                name: "Mike Johnson",
                imageUrl: "/api/placeholder/32/32",
            },
        ],
        status: "CLOSED",
    },
    {
        id: "3",
        name: "Organize Library Books",
        description:
            "Sort and organize books in the library according to categories and alphabetical order.",
        reward: 12.5,
        contributors: [],
        status: "OPEN",
    },
    {
        id: "4",
        name: "Garden Maintenance",
        description:
            "Help maintain the garden by watering plants, removing weeds, and general cleanup.",
        reward: 18.0,
        contributors: [
            {
                id: "4",
                name: "Sarah Wilson",
                imageUrl: "/api/placeholder/32/32",
            },
        ],
        status: "OPEN",
    },
    {
        id: "5",
        name: "Assist with Homework",
        description: "Help younger residents with their homework and studies.",
        reward: 25.0,
        contributors: [
            { id: "5", name: "Tom Brown", imageUrl: "/api/placeholder/32/32" },
            { id: "6", name: "Lisa Chen", imageUrl: "/api/placeholder/32/32" },
        ],
        status: "CLOSED",
    },
];

const TaskPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "CLOSED">(
        "ALL"
    );

    const filteredTasks = SAMPLE_TASKS.filter((task) => {
        const matches = task.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "ALL" || task.status === statusFilter;
        return matches && matchesStatus;
    });

    const handleAcceptTask = (taskId: string) => {
        console.log("Task Accepted:", taskId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-6">Available Tasks</h1>

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
                                        All Tasks
                                    </SelectItem>
                                    <SelectItem value="OPEN">
                                        Open Tasks
                                    </SelectItem>
                                    <SelectItem value="CLOSED">
                                        Closed Tasks
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onAccept={handleAcceptTask}
                        />
                    ))}

                    {filteredTasks.length === 0 && (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">
                                No tasks found matching your criteria
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TaskPage;
