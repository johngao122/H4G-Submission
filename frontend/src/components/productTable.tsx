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
    Table as TableType,
    Row,
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import {
    Plus,
    Pencil,
    ArrowUpDown,
    Trash2,
    MoreHorizontal,
    Loader2,
} from "lucide-react";
import { Product, ProductTableProps } from "@/app/types/shop";
import Link from "next/link";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";

interface ProductHeaderProps {
    selectedCount: number;
    onAddNew: () => void;
    onOpenDeleteDialog: (productIds: string[]) => void;
    selectedProductIds: string[];
    isDeleting: boolean;
}

interface MobileProductViewProps {
    table: TableType<Product>;
    onEdit: (id: string) => void;
}

interface DeleteProductDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    productCount: number;
    isDeleting: boolean;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    productCount,
    isDeleting,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {productCount > 1 ? "Products" : "Product"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        {productCount === 1
                            ? "this product"
                            : `these ${productCount} products`}
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const ProductHeader: React.FC<ProductHeaderProps> = ({
    selectedCount,
    onAddNew,
    onOpenDeleteDialog,
    selectedProductIds,
    isDeleting,
}) => {
    return (
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-2xl font-bold">Product Inventory</h2>
            <div className="flex flex-wrap gap-2">
                {selectedCount > 0 && (
                    <Button
                        variant="destructive"
                        onClick={() => onOpenDeleteDialog(selectedProductIds)}
                        className="w-full sm:w-auto"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected ({selectedCount})
                            </>
                        )}
                    </Button>
                )}
                <Button
                    onClick={onAddNew}
                    className="w-full sm:w-auto"
                    disabled={isDeleting}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Item
                </Button>
            </div>
        </div>
    );
};

const MobileProductView: React.FC<MobileProductViewProps> = ({
    table,
    onEdit,
}) => {
    return (
        <div className="space-y-4 md:hidden">
            {table.getRowModel().rows.map((row: Row<Product>) => (
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
                                />
                                <div>
                                    <Link
                                        href={`/admin/dashboard/inventory/${row.original.id}`}
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        {row.getValue("name")}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        ID: {row.getValue("id")}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => onEdit(row.original.id)}
                                className="p-0 h-8 w-8"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Category:</span>
                                <span>{row.getValue("Category")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Price:</span>
                                <span className="font-medium">
                                    $
                                    {(row.getValue("price") as number).toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Quantity:</span>
                                <span className="font-medium">
                                    {row.getValue("quantity")}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    onDeleteProduct,
    onBulkDelete,
    isDeleting,
}) => {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
        {}
    );
    const [deleteDialogState, setDeleteDialogState] = React.useState<{
        isOpen: boolean;
        productIds: string[];
    }>({
        isOpen: false,
        productIds: [],
    });

    const handleDeleteDialogOpen = (productIds: string[]) => {
        setDeleteDialogState({
            isOpen: true,
            productIds,
        });
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleDeleteConfirm = async () => {
        try {
            if (deleteDialogState.productIds.length === 1) {
                await onDeleteProduct(deleteDialogState.productIds[0]);
            } else {
                await onBulkDelete(deleteDialogState.productIds);
            }
            setRowSelection({});
        } catch (error) {
            console.error("Error deleting products:", error);
            // Handle error case if needed
        } finally {
            handleDeleteDialogClose();
        }
    };
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

    const selectedProductIds = Object.keys(rowSelection).map(
        (index) => products[parseInt(index)].id
    );

    return (
        <div className="space-y-4">
            <DeleteProductDialog
                isOpen={deleteDialogState.isOpen}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteDialogClose}
                productCount={deleteDialogState.productIds.length}
                isDeleting={isDeleting}
            />

            <ProductHeader
                selectedCount={Object.keys(rowSelection).length}
                onAddNew={() => router.push("/admin/dashboard/inventory/new")}
                onOpenDeleteDialog={handleDeleteDialogOpen}
                selectedProductIds={selectedProductIds}
                isDeleting={isDeleting}
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

            <MobileProductView
                table={table}
                onEdit={(id) =>
                    router.push(`/admin/dashboard/inventory/${id}/edit`)
                }
            />
        </div>
    );
};

export default ProductTable;
