"use client";

import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth, useUser } from "@clerk/nextjs";
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

interface TaskCardProps {
    task: Task;
    onAccept: (taskId: string) => void;
    refreshTasks: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onAccept,
    refreshTasks,
}) => {
    const { userId } = useAuth();
    const { user } = useUser();
    const { toast } = useToast();

    const isUserPartOfTask = useCallback(() => {
        return task.contributors.some(
            (contributor) => contributor.userId === userId
        );
    }, [task.contributors, userId]);

    const getUserTaskStatus = useCallback(() => {
        const userContribution = task.contributors.find(
            (contributor) => contributor.userId === userId
        );
        return userContribution?.status || null;
    }, [task.contributors, userId]);

    const handleAcceptTask = async () => {
        if (!userId || !user) {
            toast({
                title: "Error",
                description: "You must be logged in to accept tasks",
                variant: "destructive",
            });
            return;
        }

        if (isUserPartOfTask()) {
            toast({
                title: "Error",
                description: "You are already part of this task",
                variant: "destructive",
            });
            return;
        }

        try {
            const newContributor: Contributor = {
                taskId: task.taskId,
                userId: userId,
                contributorName: `${user.firstName} ${user.lastName}`.trim(),
                datetime: new Date().toISOString(),
                status: "PENDING",
            };

            const updatedTask: Task = {
                ...task,
                contributors: [...task.contributors, newContributor],
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/tasks/${task.taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTask),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to accept task");
            }

            toast({
                title: "Success",
                description: "You have successfully joined the task",
            });

            refreshTasks();
            onAccept(task.taskId);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to accept task. Please try again.",
                variant: "destructive",
            });
        }
    };

    const getStatusDisplay = () => {
        if (isUserPartOfTask()) {
            const status = getUserTaskStatus();
            return (
                <Badge variant="outline" className="ml-2">
                    Your status: {status}
                </Badge>
            );
        }
        return null;
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card
            className={`w-full ${task.status === "CLOSED" ? "opacity-50" : ""}`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-bold">
                        {task.taskName}
                    </CardTitle>
                    {getStatusDisplay()}
                </div>
                <Badge
                    variant={task.status === "OPEN" ? "default" : "secondary"}
                >
                    {task.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">{task.taskDesc}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {task.contributors.map((contributor, index) => (
                                <Avatar
                                    key={`${contributor.userId}-${index}`}
                                    className="border-2 border-white w-8 h-8"
                                >
                                    <AvatarFallback>
                                        {getInitials(
                                            contributor.contributorName
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <div className="text-sm font-semibold">
                            Reward: ${task.taskReward.toFixed(2)}
                        </div>
                    </div>

                    {task.status === "OPEN" && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full mt-4">
                                    View Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{task.taskName}</DialogTitle>
                                    <DialogDescription>
                                        {task.taskDesc}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Current Contributors
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {task.contributors.map(
                                                (contributor, index) => (
                                                    <div
                                                        key={`${contributor.userId}-${index}`}
                                                        className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                                                    >
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarFallback>
                                                                {getInitials(
                                                                    contributor.contributorName
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">
                                                            {
                                                                contributor.contributorName
                                                            }
                                                        </span>
                                                        <Badge variant="outline">
                                                            {contributor.status}
                                                        </Badge>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Reward
                                        </h4>
                                        <p className="text-lg font-bold">
                                            ${task.taskReward.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        className="bg-green-700"
                                        onClick={handleAcceptTask}
                                        disabled={isUserPartOfTask()}
                                    >
                                        {isUserPartOfTask()
                                            ? "Already Joined"
                                            : "Join Task"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export { TaskCard };
