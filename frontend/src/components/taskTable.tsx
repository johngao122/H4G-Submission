"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    Table as TableType,
    Row,
} from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Contributor {
    taskId: string;
    userId: string;
    contributorName: string;
    datetime: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

interface Task {
    taskId: string;
    taskName: string;
    taskDesc: string;
    taskReward: number;
    createdOn: string;
    contributors: Contributor[];
    status: "OPEN" | "CLOSED";
}

interface TableViewProps {
    table: TableType<Task>;
}

interface ResponsiveHeaderProps {
    table: TableType<Task>;
}

interface MobileCardViewProps {
    table: TableType<Task>;
    onTaskClick: (task: Task) => void;
}

const TaskTableAdmin = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<{
        type: "CONTRIBUTOR" | "TASK";
        action: "APPROVED" | "REJECTED" | "OPEN" | "CLOSE";
        taskId: string;
        contributorId?: string;
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingError, setProcessingError] = useState<string | null>(null);

    const router = useRouter();
    const { toast } = useToast();

    const fetchTasks = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/tasks`
            );
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast({
                title: "Error",
                description: "Failed to fetch tasks",
                variant: "destructive",
            });
        }
    };

    const handleProcessTask = async (taskId: string) => {
        setIsProcessing(true);
        setProcessingError(null);

        try {
            // First, process the task
            const processResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/tasks/process/${taskId}`,
                {
                    method: "POST",
                }
            );

            if (!processResponse.ok) {
                throw new Error("Failed to process task");
            }

            const deleteResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/tasks/${taskId}`,
                {
                    method: "DELETE",
                }
            );

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete task");
            }

            await fetchTasks();

            toast({
                title: "Success",
                description: "Task processed and removed successfully",
            });

            setDialogOpen(false);
        } catch (error) {
            console.error("Error processing task:", error);
            setProcessingError(
                error instanceof Error
                    ? error.message
                    : "Failed to process task"
            );

            toast({
                title: "Error",
                description: "Failed to process task",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskStatusChange = async (
        taskId: string,
        newStatus: "OPEN" | "CLOSED"
    ) => {
        try {
            let response;
            if (newStatus === "CLOSED") {
                response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/tasks/close/${taskId}`,
                    {
                        method: "POST",
                    }
                );
            } else {
                const taskToUpdate = tasks.find(
                    (task) => task.taskId === taskId
                );
                if (!taskToUpdate) {
                    throw new Error("Task not found");
                }
                response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/tasks/${taskId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...taskToUpdate,
                            status: "OPEN",
                        }),
                    }
                );
            }

            if (!response.ok)
                throw new Error(`Failed to ${newStatus.toLowerCase()} task`);
            await fetchTasks();
            if (newStatus === "CLOSED") {
                const message = `Task closed successfully`;
                toast({
                    title: "Success",
                    description: `Task ${newStatus.toLowerCase()}ed successfully`,
                });
            } else {
                const message = `Task opened successfully`;
                toast({
                    title: "Success",
                    description: `Task ${newStatus.toLowerCase()}ed successfully`,
                });
            }
        } catch (error) {
            if (newStatus === "CLOSED") {
                toast({
                    title: "Error",
                    description: `Failed to close task`,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Error",
                    description: `Failed to open task`,
                    variant: "destructive",
                });
            }
        }
    };

    const handleContributorStatusChange = async (
        taskId: string,
        contributorId: string,
        newStatus: "APPROVED" | "REJECTED"
    ) => {
        try {
            const taskToUpdate = tasks.find((task) => task.taskId === taskId);
            if (!taskToUpdate) {
                throw new Error("Task not found");
            }

            // Create the request body exactly as the API expects
            const requestBody = {
                taskId: taskToUpdate.taskId,
                taskName: taskToUpdate.taskName,
                taskDesc: taskToUpdate.taskDesc,
                taskReward: taskToUpdate.taskReward,
                createdOn: taskToUpdate.createdOn, // Map from datetime to createdOn
                status: taskToUpdate.status,
                contributors: taskToUpdate.contributors.map((contributor) => {
                    if (contributor.userId === contributorId) {
                        return {
                            taskId: contributor.taskId,
                            userId: contributor.userId,
                            contributorName: contributor.contributorName,
                            datetime: contributor.datetime,
                            status: newStatus,
                        };
                    }
                    return contributor;
                }),
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/tasks/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                        `Failed to ${newStatus.toLowerCase()} contributor`
                );
            }
            const updatedTask = await response.json();
            await fetchTasks();
            setSelectedTask(updatedTask);
            toast({
                title: "Success",
                description: `Contributor ${newStatus.toLowerCase()} successfully`,
            });
        } catch (error) {
            console.error(
                `Error ${newStatus.toLowerCase()}ing contributor:`,
                error
            );
            toast({
                title: "Error",
                description: `Failed to ${newStatus.toLowerCase()} contributor`,
                variant: "destructive",
            });
        }
    };

    const columns: ColumnDef<Task>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="w-[30px] px-2">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-[30px] px-2">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "taskName",
            header: ({ column }) => (
                <div className="flex items-center space-x-2 px-4">
                    <span>Task Name</span>
                    <ArrowUpDown
                        className="h-4 w-4 cursor-pointer"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-4 font-medium">{row.original.taskName}</div>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <div className="flex items-center space-x-2">
                    <span>Status</span>
                    <ArrowUpDown
                        className="h-4 w-4 cursor-pointer"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div>
                    <Badge
                        variant={
                            row.original.status === "OPEN"
                                ? "default"
                                : "secondary"
                        }
                        className="font-medium"
                    >
                        {row.original.status}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "taskReward",
            header: ({ column }) => (
                <div className="flex items-center space-x-2 px-4">
                    <span>Reward</span>
                    <ArrowUpDown
                        className="h-4 w-4 cursor-pointer"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-4 font-medium tabular-nums">
                    ${row.original.taskReward.toFixed(2)}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: tasks,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setDialogOpen(true);
    };

    const handleBulkProcess = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        setIsProcessing(true);
        setProcessingError(null);

        try {
            await Promise.all(
                selectedRows.map((row) =>
                    handleProcessTask(row.original.taskId)
                )
            );

            table.resetRowSelection();
            toast({
                title: "Success",
                description: "All selected tasks processed successfully",
            });
        } catch (error) {
            console.error("Error processing tasks:", error);
            toast({
                title: "Error",
                description: "Failed to process some tasks",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBulkAction = async (action: "OPEN" | "CLOSED") => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const tasks = selectedRows.map((row) => ({
            taskId: row.original.taskId,
            currentStatus: row.original.status,
        }));

        const validTasks = tasks.filter(
            (task) =>
                (action === "CLOSED" && task.currentStatus === "OPEN") ||
                (action === "OPEN" && task.currentStatus === "CLOSED")
        );

        if (validTasks.length === 0) {
            toast({
                title: "No eligible tasks",
                description: `No tasks can be ${action.toLowerCase()}d`,
                variant: "destructive",
            });
            return;
        }

        await Promise.all(
            validTasks.map((task) =>
                handleTaskStatusChange(task.taskId, action)
            )
        );
        table.resetRowSelection();
    };

    const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ table }) => {
        return (
            <div className="flex flex-col space-y-4 mb-6 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                <div className="flex flex-col space-y-4 sm:space-y-2">
                    <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                        <h1 className="text-2xl font-bold">Task Management</h1>
                    </div>
                    <Input
                        placeholder="Filter tasks..."
                        value={
                            (table
                                .getColumn("taskName")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(e) =>
                            table
                                .getColumn("taskName")
                                ?.setFilterValue(e.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    <Button
                        onClick={() =>
                            router.push("/admin/dashboard/tasks/createTask")
                        }
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Create Task
                    </Button>
                    <Button
                        onClick={() => handleBulkAction("CLOSED")}
                        disabled={
                            table.getFilteredSelectedRowModel().rows.length ===
                                0 || isProcessing
                        }
                        variant="destructive"
                    >
                        Close Selected
                    </Button>
                    <Button
                        onClick={() => handleBulkAction("OPEN")}
                        disabled={
                            table.getFilteredSelectedRowModel().rows.length ===
                                0 || isProcessing
                        }
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Open Selected
                    </Button>
                    <Button
                        onClick={handleBulkProcess}
                        disabled={
                            table.getFilteredSelectedRowModel().rows.length ===
                                0 || isProcessing
                        }
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Process Selected"
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    const DesktopTableView: React.FC<TableViewProps> = ({ table }) => {
        return (
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-transparent"
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="h-10 text-sm font-medium text-gray-500"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className="hover:bg-gray-50"
                                    onClick={() =>
                                        handleTaskClick(row.original)
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="h-12"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const MobileCardView: React.FC<MobileCardViewProps> = ({
        table,
        onTaskClick,
    }) => {
        return (
            <div className="space-y-4 md:hidden">
                {table.getRowModel().rows.map((row: Row<Task>) => (
                    <Card
                        key={row.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => onTaskClick(row.original)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={row.getIsSelected()}
                                        onCheckedChange={(value) =>
                                            row.toggleSelected(!!value)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label="Select row"
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {row.original.taskName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {row.original.taskDesc}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={
                                        row.original.status === "OPEN"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {row.original.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                    Contributors:
                                </span>
                                <div className="flex -space-x-2">
                                    {row.original.contributors.map(
                                        (contributor) => (
                                            <Avatar
                                                key={contributor.userId}
                                                className="border-2 border-white w-8 h-8"
                                            >
                                                <AvatarFallback>
                                                    {
                                                        contributor
                                                            .contributorName[0]
                                                    }
                                                </AvatarFallback>
                                            </Avatar>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-2">
                                <span className="text-gray-500">Reward:</span>
                                <span className="font-medium">
                                    ${row.original.taskReward.toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <ResponsiveHeader table={table} />
            <DesktopTableView table={table} />
            <MobileCardView table={table} onTaskClick={handleTaskClick} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedTask?.taskName}</DialogTitle>
                        <DialogDescription>
                            {selectedTask?.taskDesc}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Contributors</h4>
                            <div className="grid gap-4">
                                {selectedTask?.contributors.map(
                                    (contributor) => (
                                        <Card key={contributor.userId}>
                                            <CardContent className="pt-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar>
                                                            <AvatarFallback>
                                                                {
                                                                    contributor
                                                                        .contributorName[0]
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold">
                                                                {
                                                                    contributor.contributorName
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Joined:{" "}
                                                                {new Date(
                                                                    contributor.datetime
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            contributor.status ===
                                                            "PENDING"
                                                                ? "default"
                                                                : contributor.status ===
                                                                  "APPROVED"
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                    >
                                                        {contributor.status}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                            {(contributor.status ===
                                                "PENDING" ||
                                                contributor.status ===
                                                    "REJECTED") && (
                                                <CardFooter className="flex justify-end space-x-2">
                                                    {contributor.status ===
                                                        "PENDING" && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedAction(
                                                                        {
                                                                            type: "CONTRIBUTOR",
                                                                            action: "REJECTED",
                                                                            taskId: selectedTask.taskId,
                                                                            contributorId:
                                                                                contributor.userId,
                                                                        }
                                                                    );
                                                                    setConfirmDialogOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                Reject
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedAction(
                                                                        {
                                                                            type: "CONTRIBUTOR",
                                                                            action: "APPROVED",
                                                                            taskId: selectedTask.taskId,
                                                                            contributorId:
                                                                                contributor.userId,
                                                                        }
                                                                    );
                                                                    setConfirmDialogOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                Approve
                                                            </Button>
                                                        </>
                                                    )}

                                                    {contributor.status ===
                                                        "REJECTED" && (
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedAction(
                                                                    {
                                                                        type: "CONTRIBUTOR",
                                                                        action: "APPROVED",
                                                                        taskId: selectedTask.taskId,
                                                                        contributorId:
                                                                            contributor.userId,
                                                                    }
                                                                );
                                                                setConfirmDialogOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                </CardFooter>
                                            )}
                                        </Card>
                                    )
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Reward</h4>
                            <p className="text-lg font-bold">
                                ${selectedTask?.taskReward.toFixed(2)}
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={() =>
                                    handleProcessTask(
                                        selectedTask?.taskId || ""
                                    )
                                }
                                disabled={
                                    isProcessing ||
                                    selectedTask?.status === "CLOSED"
                                }
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Process Task"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to{" "}
                            {selectedAction?.action.toLowerCase()} this{" "}
                            {selectedAction?.type.toLowerCase()}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (selectedAction) {
                                    if (
                                        selectedAction.type === "CONTRIBUTOR" &&
                                        selectedAction.contributorId
                                    ) {
                                        handleContributorStatusChange(
                                            selectedAction.taskId,
                                            selectedAction.contributorId,
                                            selectedAction.action as
                                                | "APPROVED"
                                                | "REJECTED"
                                        );
                                    } else {
                                        handleTaskStatusChange(
                                            selectedAction.taskId,
                                            selectedAction.action as
                                                | "OPEN"
                                                | "CLOSED"
                                        );
                                    }
                                    setConfirmDialogOpen(false);
                                }
                            }}
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default TaskTableAdmin;
