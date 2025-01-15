"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
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
    Column,
    HeaderGroup,
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import type { Task } from "@/app/types/task";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const SAMPLE_TASKS: Task[] = [
    {
        id: "1",
        name: "Sunat",
        description: "Helped 5 people sunat",
        reward: 5,
        contributors: [
            { id: "1", name: "Joseph Tan", imageUrl: "/api/placeholder/32/32" },
        ],
        status: "CLOSED",
    },
    {
        id: "2",
        name: "Died",
        description: "Killed 3 people",
        reward: 15,
        contributors: [
            {
                id: "2",
                name: "Kean Meng Lim",
                imageUrl: "/api/placeholder/32/32",
            },
        ],
        status: "CLOSED",
    },
];

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
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const columns: ColumnDef<Task>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="px-1">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1">
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
            accessorKey: "contributors",
            header: ({ column }) => {
                return (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                            className="hover:bg-transparent px-0 font-medium"
                        >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const contributor = row.original.contributors[0];
                return <div className="">{contributor.name}</div>;
            },
            sortingFn: (rowA, rowB) => {
                const nameA = rowA.original.contributors[0].name.toLowerCase();
                const nameB = rowB.original.contributors[0].name.toLowerCase();
                return nameA.localeCompare(nameB);
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                            className="hover:bg-transparent px-0 font-medium"
                        >
                            Task
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                return <div className="">{row.getValue("name")}</div>;
            },
        },
        {
            id: "status",
            header: ({ column }) => {
                return (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                            className="hover:bg-transparent px-0 font-medium"
                        >
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                return <div className="">{row.original.status}</div>;
            },
            sortingFn: "text",
        },
        {
            accessorKey: "reward",
            header: ({ column }) => {
                return (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                            className="hover:bg-transparent px-0 font-medium"
                        >
                            Voucher Credits
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                return <div className="">${row.original.reward}</div>;
            },
            sortingFn: (rowA, rowB) => {
                return rowA.original.reward - rowB.original.reward;
            },
        },
    ];

    const table = useReactTable({
        data: SAMPLE_TASKS,
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

    const handleApproveSelected = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedTaskIds = selectedRows.map((row) => row.original.id);

        console.log("Approving tasks:", selectedTaskIds);
        table.resetRowSelection();
    };

    const handleRejectSelected = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedTaskIds = selectedRows.map((row) => row.original.id);

        console.log("Rejecting tasks:", selectedTaskIds);
        table.resetRowSelection();
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
                                            {row.original.contributors[0].name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {row.getValue("name")}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={
                                        row.original.status === "CLOSED"
                                            ? "secondary"
                                            : "default"
                                    }
                                >
                                    {row.original.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Reward:</span>
                                <span className="font-medium">
                                    ${row.original.reward}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ table }) => {
        const router = useRouter();
        const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
        };

        return (
            <div className="flex flex-col space-y-4 mb-6 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                <div className="flex flex-col space-y-4 sm:space-y-2">
                    <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                        <h1 className="text-2xl font-bold">
                            Vet Pending Tasks
                        </h1>
                        <Button
                            onClick={() =>
                                router.push("/admin/dashboard/tasks/createTask")
                            }
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Create Task
                        </Button>
                    </div>
                    <Input
                        placeholder="Filter tasks..."
                        value={
                            (table
                                .getColumn("name")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={handleFilterChange}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column: Column<Task>) =>
                                    column.getCanHide()
                                )
                                .map((column: Column<Task>) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={handleApproveSelected}
                        disabled={
                            table.getFilteredSelectedRowModel().rows.length ===
                            0
                        }
                        className="bg-green-100 text-green-700 hover:bg-green-200 w-full sm:w-auto"
                    >
                        Approve Selected
                    </Button>
                    <Button
                        onClick={handleRejectSelected}
                        disabled={
                            table.getFilteredSelectedRowModel().rows.length ===
                            0
                        }
                        variant="destructive"
                        className="w-full sm:w-auto"
                    >
                        Reject Selected
                    </Button>
                </div>
            </div>
        );
    };

    const DesktopTableView: React.FC<TableViewProps> = ({ table }) => {
        return (
            <div className="hidden md:block border rounded-lg">
                <Table>
                    <TableHeader>
                        {table
                            .getHeaderGroups()
                            .map((headerGroup: HeaderGroup<Task>) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
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
                            table.getRowModel().rows.map((row: Row<Task>) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() =>
                                        handleTaskClick(row.original)
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    colSpan={table.getAllColumns().length}
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

    return (
        <div className="container mx-auto p-4">
            <ResponsiveHeader table={table} />
            <DesktopTableView table={table} />
            <MobileCardView table={table} onTaskClick={handleTaskClick} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedTask?.name}</DialogTitle>
                        <DialogDescription>
                            {selectedTask?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Contributors</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedTask?.contributors.map(
                                    (contributor) => (
                                        <div
                                            key={contributor.id}
                                            className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                                        >
                                            <Avatar className="w-6 h-6">
                                                <AvatarImage
                                                    src={contributor.imageUrl}
                                                    alt={contributor.name}
                                                />
                                                <AvatarFallback>
                                                    {contributor.name.charAt(0)}
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
                            <h4 className="font-semibold mb-2">Reward</h4>
                            <p className="text-lg font-bold">
                                ${selectedTask?.reward.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TaskTableAdmin;
