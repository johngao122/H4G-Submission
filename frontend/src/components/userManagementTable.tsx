"use client";

import React, { useEffect, useState } from "react";
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    Table as TableType,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent } from "./ui/card";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/app/types/user";
import { useRouter } from "next/navigation";

interface ResponsiveHeaderProps {
    table: TableType<User>;
    selectedRows: Row<User>[];
    isLoading: boolean;
    onAddUser: () => void;
    onOpenSuspendDialog: (
        userIds: string[],
        userName: string,
        action: "SUSPEND" | "ACTIVATE"
    ) => void;
    onOpenDeleteDialog: (userIds: string[]) => void;
}

interface MobileCardViewProps {
    table: TableType<User>;
    isLoading: boolean;
    onUpdateUser: (userId: string, action: string, data?: any) => Promise<void>;
}

interface SuspendUserDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    userName: string;
    action: "SUSPEND" | "ACTIVATE";
}

interface DeleteUserDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    count: number;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    count,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {count === 1 ? "User" : "Users"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        {count === 1 ? "this user" : `${count} users`}? This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const SuspendUserDialog: React.FC<SuspendUserDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    userName,
    action,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {action === "SUSPEND" ? "Suspend" : "Activate"} User
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to {action.toLowerCase()}{" "}
                        {userName}?
                        {action === "SUSPEND" &&
                            " This will prevent them from accessing the system until reactivated."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={
                            action === "SUSPEND"
                                ? "bg-red-600 hover:bg-red-700"
                                : ""
                        }
                    >
                        {action === "SUSPEND" ? "Suspend" : "Activate"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
    table,
    selectedRows,
    isLoading,
    onAddUser,
    onOpenSuspendDialog,
    onOpenDeleteDialog,
}) => {
    const router = useRouter();
    const hasSelectedSuspendedUsers = selectedRows.some(
        (row) => row.original.status === "SUSPENDED"
    );
    const hasSelectedActiveUsers = selectedRows.some(
        (row) => row.original.status === "ACTIVE"
    );

    return (
        <div className="flex flex-col space-y-4 mb-6 sm:space-y-0">
            <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-sm text-muted-foreground">
                        {selectedRows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        disabled={isLoading}
                        onClick={onAddUser}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                    {hasSelectedSuspendedUsers && (
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => {
                                const selectedUsers = selectedRows.map(
                                    (row) => row.original.id
                                );
                                const userName =
                                    selectedRows.length === 1
                                        ? selectedRows[0].original.name
                                        : `${selectedRows.length} users`;
                                onOpenSuspendDialog(
                                    selectedUsers,
                                    userName,
                                    "ACTIVATE"
                                );
                            }}
                            className="w-full sm:w-auto"
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
                            onClick={() => {
                                const selectedUsers = selectedRows.map(
                                    (row) => row.original.id
                                );
                                const userName =
                                    selectedRows.length === 1
                                        ? selectedRows[0].original.name
                                        : `${selectedRows.length} users`;
                                onOpenSuspendDialog(
                                    selectedUsers,
                                    userName,
                                    "SUSPEND"
                                );
                            }}
                            className="w-full sm:w-auto"
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
                            onOpenDeleteDialog(selectedIds);
                        }}
                        className="w-full sm:w-auto"
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

            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
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
                    className="w-full sm:max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
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
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

const MobileCardView: React.FC<MobileCardViewProps> = ({
    table,
    isLoading,
    onUpdateUser,
}) => {
    const router = useRouter();
    return (
        <div className="space-y-4 md:hidden">
            {table.getRowModel().rows.map((row) => (
                <Card key={row.id}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={row.getIsSelected()}
                                    onCheckedChange={(value) =>
                                        row.toggleSelected(!!value)
                                    }
                                    aria-label="Select row"
                                    className="translate-y-[2px]"
                                />
                                <div>
                                    <p className="font-medium">
                                        {row.getValue("name")}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {row.getValue("id")}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        disabled={isLoading}
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            router.push(
                                                "/users/" + row.getValue("id")
                                            );
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
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* User Details */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Role:</span>
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
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status:</span>
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
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Balance:</span>
                                <span>
                                    {row.original.role === "admin"
                                        ? "N/A"
                                        : `$${row.original.voucherBalance.toFixed(
                                              2
                                          )}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Created:</span>
                                <span>
                                    {new Date(
                                        row.getValue("createdAt")
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export function UserManagementDataTable() {
    const router = useRouter();
    const { toast } = useToast();
    const [suspendDialogState, setSuspendDialogState] = useState<{
        isOpen: boolean;
        userIds: string[];
        userName: string;
        action: "SUSPEND" | "ACTIVATE";
    }>({
        isOpen: false,
        userIds: [],
        userName: "",
        action: "SUSPEND",
    });
    const [deleteDialogState, setDeleteDialogState] = useState<{
        isOpen: boolean;
        userIds: string[];
    }>({
        isOpen: false,
        userIds: [],
    });
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const handleSuspendDialogOpen = (
        userIds: string[],
        userName: string,
        action: "SUSPEND" | "ACTIVATE"
    ) => {
        setSuspendDialogState({
            isOpen: true,
            userIds,
            userName,
            action,
        });
    };

    const handleDeleteDialogOpen = (userIds: string[]) => {
        setDeleteDialogState({
            isOpen: true,
            userIds,
        });
    };

    const handleSuspendDialogClose = () => {
        setSuspendDialogState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogState((prev) => ({ ...prev, isOpen: false }));
    };

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
                                        router.push(
                                            `/admin/dashboard/users/${user.id}`
                                        );
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
        router.push("/admin/dashboard/users/createUser");
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <SuspendUserDialog
                isOpen={suspendDialogState.isOpen}
                onConfirm={() => {
                    Promise.all(
                        suspendDialogState.userIds.map((userId) =>
                            handleUpdateUser(userId, suspendDialogState.action)
                        )
                    );
                    handleSuspendDialogClose();
                    setRowSelection({});
                }}
                onCancel={handleSuspendDialogClose}
                userName={suspendDialogState.userName}
                action={suspendDialogState.action}
            />
            <DeleteUserDialog
                isOpen={deleteDialogState.isOpen}
                onConfirm={() => {
                    handleDeleteUsers(deleteDialogState.userIds);
                    handleDeleteDialogClose();
                }}
                onCancel={handleDeleteDialogClose}
                count={deleteDialogState.userIds.length}
            />
            {isLoading && users.length === 0 ? (
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <>
                    <ResponsiveHeader
                        table={table}
                        selectedRows={table.getFilteredSelectedRowModel().rows}
                        isLoading={isLoading}
                        onAddUser={handleAddUser}
                        onOpenSuspendDialog={handleSuspendDialogOpen}
                        onOpenDeleteDialog={handleDeleteDialogOpen}
                    />

                    <div className="hidden md:block rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
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
                                                row.getIsSelected() &&
                                                "selected"
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
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

                    <MobileCardView
                        table={table}
                        isLoading={isLoading}
                        onUpdateUser={handleUpdateUser}
                    />

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
                </>
            )}
        </div>
    );
}

export default UserManagementDataTable;
