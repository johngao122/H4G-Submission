"use client";

import React, { useEffect, useState } from "react";
import {
    Column,
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
} from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    MoreHorizontal,
    Plus,
    UserCog,
    Trash2,
    ArrowUpDown,
    Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/app/types/user";
import { useRouter } from "next/navigation";

export function UserManagementDataTable() {
    const router = useRouter();
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users");
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setUsers(data.users);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch users",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async (
        userId: string,
        action: string,
        data?: any
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/users", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, action, data }),
            });

            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }

            toast({
                title: "Success",
                description: `User ${action.toLowerCase()}ed successfully`,
            });

            await fetchUsers();
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${action.toLowerCase()} user`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkAction = async (action: string) => {
        const selectedUsers = table.getFilteredSelectedRowModel().rows;

        try {
            await Promise.all(
                selectedUsers.map((row) =>
                    handleUpdateUser(row.original.id, action)
                )
            );
            setRowSelection({});
        } catch (error) {
            console.error(`Bulk ${action} failed:`, error);
        }
    };

    const handleDeleteUsers = async (userIds: string[]) => {
        setIsLoading(true);
        try {
            await Promise.all(
                userIds.map((userId) =>
                    fetch("/api/users", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userId }),
                    })
                )
            );

            toast({
                title: "Success",
                description: "Users deleted successfully",
            });

            await fetchUsers();
            setRowSelection({});
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete users",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <div className="px-1">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                        className="translate-y-[2px]"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-[2px]"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => <div className="text-left">UID</div>,
            cell: ({ row }) => (
                <div className="text-left font-medium">
                    {row.getValue("id")}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="text-left">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                            className="p-0 hover:bg-transparent"
                        >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-left">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "role",
            header: ({ column }) => <div className="text-left">Role</div>,
            cell: ({ row }) => (
                <div className="text-left">
                    <Badge
                        variant={
                            row.getValue("role") === "admin"
                                ? "default"
                                : "secondary"
                        }
                    >
                        {row.getValue("role")}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "voucherBalance",
            header: ({ column }) => {
                return (
                    <div className="text-left">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                            className="p-0 hover:bg-transparent"
                        >
                            Voucher Balance
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="text-left">
                        {user.role === "admin"
                            ? "N/A"
                            : `$${user.voucherBalance.toFixed(2)}`}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => <div className="text-left">Status</div>,
            cell: ({ row }) => (
                <div className="text-left">
                    <Badge
                        variant={
                            row.getValue("status") === "ACTIVE"
                                ? "default"
                                : "destructive"
                        }
                    >
                        {row.getValue("status")}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <div className="text-left">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                            className="p-0 hover:bg-transparent"
                        >
                            Created At
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-left">
                    {new Date(row.getValue("createdAt")).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    disabled={isLoading}
                                >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        /* Handle edit */
                                    }}
                                    disabled={isLoading}
                                >
                                    Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        /* Handle password reset */
                                    }}
                                    disabled={isLoading}
                                >
                                    Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleUpdateUser(
                                            user.id,
                                            user.status === "ACTIVE"
                                                ? "SUSPEND"
                                                : "ACTIVATE"
                                        )
                                    }
                                    disabled={isLoading}
                                    className={
                                        user.status === "ACTIVE"
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }
                                >
                                    {user.status === "ACTIVE"
                                        ? "Suspend User"
                                        : "Unsuspend User"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: users,
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

    if (isLoading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const hasSelectedSuspendedUsers = selectedRows.some(
        (row) => row.original.status === "SUSPENDED"
    );
    const hasSelectedActiveUsers = selectedRows.some(
        (row) => row.original.status === "ACTIVE"
    );

    const handleAddUser = () => {
        router.push("/admin/users/add");
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-sm text-muted-foreground">
                        {selectedRows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </p>
                </div>
                <div className="space-x-2">
                    <Button disabled={isLoading} onClick={handleAddUser}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                    {hasSelectedSuspendedUsers && (
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleBulkAction("ACTIVATE")}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <UserCog className="mr-2 h-4 w-4" />
                            )}
                            Unsuspend Selected
                        </Button>
                    )}
                    {hasSelectedActiveUsers && (
                        <Button
                            variant="destructive"
                            disabled={isLoading}
                            onClick={() => handleBulkAction("SUSPEND")}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <UserCog className="mr-2 h-4 w-4" />
                            )}
                            Suspend Selected
                        </Button>
                    )}
                    <Button
                        variant="destructive"
                        disabled={isLoading || selectedRows.length === 0}
                        onClick={() => {
                            const selectedIds = selectedRows.map(
                                (row) => row.original.id
                            );
                            handleDeleteUsers(selectedIds);
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete Selected
                    </Button>
                </div>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter names..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
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
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
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

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default UserManagementDataTable;
