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
        console.log("Task Accepted:", task.id);
        onAccept(task.id);
    };
};
