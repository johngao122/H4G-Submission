import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
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
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronUp,
    ChevronDown,
    Loader2,
    Search,
} from "lucide-react";

interface Transaction {
    transactionId: string;
    userId: string;
    productId: string;
    qtyPurchased: number;
    totalPrice: number;
    datetime: string;
}

interface ProductDetails {
    productId: string;
    name: string;
    category: string;
    desc: string;
    price: number;
    quantity: number;
    productPhoto: string;
}

const TransactionHistoryTable: React.FC = () => {
    const { userId } = useAuth();
    const { toast } = useToast();
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [productDetails, setProductDetails] =
        React.useState<ProductDetails | null>(null);
    const [isLoadingProduct, setIsLoadingProduct] = React.useState(false);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [selectedTransaction, setSelectedTransaction] =
        React.useState<Transaction | null>(null);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const fetchProductDetails = async (productId: string) => {
            setIsLoadingProduct(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/products/${productId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }
                const data = await response.json();
                setProductDetails(data);
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to load product details",
                    variant: "destructive",
                });
            } finally {
                setIsLoadingProduct(false);
            }
        };

        if (selectedTransaction) {
            fetchProductDetails(selectedTransaction.productId);
        } else {
            setProductDetails(null);
        }
    }, [selectedTransaction, toast]);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    React.useEffect(() => {
        const fetchTransactions = async () => {
            if (!userId) return;
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/transactions/user/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch transactions");
                }

                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "An error occurred while fetching transactions";
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [userId, toast]);

    const formatDateTime = (datetime: string) => {
        return new Date(datetime + "Z").toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const columns: ColumnDef<Transaction>[] = [
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
        },
        {
            accessorKey: "productId",
            header: "Product ID",
            cell: ({ row }) => row.getValue("productId"),
        },
        {
            accessorKey: "qtyPurchased",
            header: "Quantity",
            cell: ({ row }) => row.getValue("qtyPurchased"),
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <p className="text-lg font-medium text-red-500">
                    Failed to load transactions
                </p>
                <p className="text-sm text-gray-500">{error}</p>
            </div>
        );
    }

    const MobileTransactionCard = ({
        transaction,
    }: {
        transaction: Transaction;
    }) => (
        <Card
            className="mb-4"
            onClick={() => setSelectedTransaction(transaction)}
        >
            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500">
                                Transaction ID
                            </p>
                            <p className="font-medium">
                                {transaction.transactionId}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-bold">
                                ${transaction.totalPrice.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p>{formatDateTime(transaction.datetime)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search transactions..."
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
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {!isMobile && (
                        <div className="rounded-md border overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        {table
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => (
                                                            <TableHead
                                                                key={header.id}
                                                            >
                                                                {header.isPlaceholder ? null : (
                                                                    <div
                                                                        className={
                                                                            header.column.getCanSort()
                                                                                ? "cursor-pointer select-none flex items-center"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        {flexRender(
                                                                            header
                                                                                .column
                                                                                .columnDef
                                                                                .header,
                                                                            header.getContext()
                                                                        )}
                                                                        {header.column.getIsSorted() && (
                                                                            <span className="ml-1">
                                                                                {header.column.getIsSorted() ===
                                                                                "asc" ? (
                                                                                    <ChevronUp className="h-4 w-4" />
                                                                                ) : (
                                                                                    <ChevronDown className="h-4 w-4" />
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </TableHead>
                                                        )
                                                    )}
                                                </TableRow>
                                            ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table
                                                .getRowModel()
                                                .rows.map((row) => (
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
                                                                <TableCell
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
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
                                                            No Transactions
                                                            Found
                                                        </p>
                                                        <p className="text-sm">
                                                            There are no
                                                            transactions in your
                                                            record yet.
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {isMobile && (
                        <div className="space-y-4">
                            {table.getRowModel().rows.map((row) => (
                                <MobileTransactionCard
                                    key={row.id}
                                    transaction={row.original}
                                />
                            ))}
                            {table.getRowModel().rows.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-lg font-medium">
                                        No Transactions Found
                                    </p>
                                    <p className="text-sm">
                                        There are no transactions in your record
                                        yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 py-4">
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
                    <DialogContent className="max-w-md mx-4">
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
                                    Purchase Details
                                </h4>
                                {isLoadingProduct ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                                    </div>
                                ) : productDetails ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={
                                                    productDetails.productPhoto
                                                }
                                                alt={productDetails.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div>
                                                <h3 className="font-medium">
                                                    {productDetails.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {productDetails.category}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-sm space-y-2">
                                            <p>{productDetails.desc}</p>
                                            <p>
                                                <span className="font-medium">
                                                    Unit Price:
                                                </span>{" "}
                                                $
                                                {productDetails.price.toFixed(
                                                    2
                                                )}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Quantity:
                                                </span>{" "}
                                                {
                                                    selectedTransaction.qtyPurchased
                                                }
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Total Amount:
                                                </span>{" "}
                                                $
                                                {selectedTransaction.totalPrice.toFixed(
                                                    2
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Failed to load product details
                                    </p>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};

export default TransactionHistoryTable;
