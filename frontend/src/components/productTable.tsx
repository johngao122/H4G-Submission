"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    RowSelectionState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Plus, Pencil, ArrowUpDown, Trash2 } from "lucide-react";
import { Product, ProductTableProps } from "@/app/types/shop";
import Link from "next/link";
import { Checkbox } from "./ui/checkbox";

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    onDeleteProduct,
    onUpdateProduct,
}) => {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
        {}
    );

    const columns: ColumnDef<Product>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="pl-0 font-semibold"
                    >
                        Product ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const id = row.getValue("id") as string;
                return (
                    <Link
                        href={`/admin/dashboard/inventory/${id}`}
                        className="text-blue-600 hover:underline"
                    >
                        {id}
                    </Link>
                );
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="pl-0 font-semibold"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const id = row.getValue("id") as string;
                return (
                    <Link
                        href={`/admin/dashboard/inventory/${id}`}
                        className="text-blue-600 hover:underline"
                    >
                        {row.getValue("name")}
                    </Link>
                );
            },
        },
        {
            accessorKey: "Category",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="pl-0 font-semibold"
                    >
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="pl-0 font-semibold"
                    >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const price = row.getValue("price") as number;
                return <div className="font-medium">${price.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="pl-0 font-semibold"
                    >
                        Quantity
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
                        {row.getValue("quantity")}
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableSorting: false,
            cell: ({ row }) => {
                const product = row.original;

                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            router.push(
                                `/admin/dashboard/inventory/${product.id}/edit`
                            )
                        }
                        className="p-0 h-8 w-8"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                );
            },
        },
    ];

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    const handleDeleteSelected = () => {
        const selectedIds = Object.keys(rowSelection).map(
            (index) => products[parseInt(index)].id
        );
        selectedIds.forEach(onDeleteProduct);
        setRowSelection({});
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Product Inventory</h2>
                <div className="flex gap-2">
                    {Object.keys(rowSelection).length > 0 && (
                        <Button
                            variant="destructive"
                            onClick={handleDeleteSelected}
                            className="flex items-center"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Selected
                        </Button>
                    )}
                    <Button
                        onClick={() =>
                            router.push("/admin/dashboard/inventory/new")
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Item
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
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
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
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
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ProductTable;
