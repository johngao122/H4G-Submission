"use client";

import React from "react";
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
import type { Task, TaskCardProps } from "@/app/types/task";

const TaskCard: React.FC<TaskCardProps> = ({ task, onAccept }) => {
    const handleAcceptTask = () => {
        // Replace when API Up (send POST to API)
        console.log("Task Accepted:", task.id);
        onAccept(task.id);
    };

    return (
        <Card
            className={`w-full ${task.status === "CLOSED" ? "opacity-50" : ""}`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{task.name}</CardTitle>
                <Badge
                    variant={task.status === "OPEN" ? "default" : "secondary"}
                >
                    {task.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {task.contributors.map((contributor) => (
                                <Avatar
                                    key={contributor.id}
                                    className="border-2 border-white w-8 h-8"
                                >
                                    <AvatarImage
                                        src={contributor.imageUrl}
                                        alt={contributor.name}
                                    />
                                    <AvatarFallback>
                                        {contributor.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <div className="text-sm font-semibold">
                            Reward: ${task.reward.toFixed(2)}
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
                                    <DialogTitle>{task.name}</DialogTitle>
                                    <DialogDescription>
                                        {task.description}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Current Contributors
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {task.contributors.map(
                                                (contributor) => (
                                                    <div
                                                        key={contributor.id}
                                                        className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                                                    >
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarImage
                                                                src={
                                                                    contributor.imageUrl
                                                                }
                                                                alt={
                                                                    contributor.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {contributor.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">
                                                            {contributor.name}
                                                        </span>
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
                                            ${task.reward.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        className="bg-green-700"
                                        onClick={handleAcceptTask}
                                    >
                                        Join Task
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
