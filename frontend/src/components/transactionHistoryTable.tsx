"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import {
    Transaction,
    TransactionDisplay,
    TransactionHistoryProps,
} from "@/app/types/transaction";

const TransactionHistoryTable: React.FC<TransactionHistoryProps> = ({
    transactions,
}) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [selectedTransaction, setSelectedTransaction] =
        React.useState<TransactionDisplay | null>(null);

    const formatDateTime = (datetime: string) => {
        return new Date(datetime).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const columns: ColumnDef<TransactionDisplay>[] = [
        {
            accessorKey: "transactionId",
            header: "Transaction ID",
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.getValue("transactionId")}
                </div>
            ),
        },
        {
            accessorKey: "datetime",
            header: "Date & Time",
            cell: ({ row }) => formatDateTime(row.getValue("datetime")),
            sortingFn: (rowA, rowB) => {
                return (
                    new Date(rowA.original.datetime).getTime() -
                    new Date(rowB.original.datetime).getTime()
                );
            },
        },
        {
            accessorKey: "items",
            header: "Items",
            cell: ({ row }) => `${row.original.items.length} items`,
            enableSorting: false,
        },
        {
            accessorKey: "totalPrice",
            header: () => <div className="text-right">Total Amount</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("totalPrice"));
                return <div className="text-right">${amount.toFixed(2)}</div>;
            },
        },
    ];

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Filter transactions..."
                            value={
                                (table
                                    .getColumn("transactionId")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn("transactionId")
                                    ?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        {...{
                                                            className:
                                                                header.column.getCanSort()
                                                                    ? "cursor-pointer select-none flex items-center"
                                                                    : "",
                                                            onClick:
                                                                header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: " 🔼",
                                                            desc: " 🔽",
                                                        }[
                                                            header.column.getIsSorted() as string
                                                        ] ?? null}
                                                    </div>
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
                                            onClick={() =>
                                                setSelectedTransaction(
                                                    row.original
                                                )
                                            }
                                            className="cursor-pointer hover:bg-gray-50"
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
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <p className="text-lg font-medium">
                                                    No Transactions Found
                                                </p>
                                                <p className="text-sm">
                                                    There are no transactions in
                                                    your record yet.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Go to first page
                                </span>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Go to previous page
                                </span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                    table.setPageIndex(table.getPageCount() - 1)
                                }
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog
                open={selectedTransaction !== null}
                onOpenChange={(open) => !open && setSelectedTransaction(null)}
            >
                {selectedTransaction && (
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                            <DialogDescription>
                                Transaction ID:{" "}
                                {selectedTransaction.transactionId}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold mb-2">
                                    Date & Time
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {formatDateTime(
                                        selectedTransaction.datetime
                                    )}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-2">
                                    Items Purchased
                                </h4>
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead className="text-right">
                                                    Subtotal
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedTransaction.items.map(
                                                (item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.productName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell>
                                                            $
                                                            {item.pricePerUnit.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            $
                                                            {(
                                                                item.quantity *
                                                                item.pricePerUnit
                                                            ).toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="font-semibold">
                                    Total Amount
                                </span>
                                <span className="text-xl font-bold">
                                    ${selectedTransaction.totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};

export default TransactionHistoryTable;
