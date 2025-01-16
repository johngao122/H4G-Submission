import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import type { PreorderCardProps, User } from "@/app/types/preorder";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface Product {
    productId: string;
    name: string;
    category: string;
    desc: string;
    price: number;
    quantity: number;
    productPhoto: string;
}

const PreorderCard: React.FC<PreorderCardProps> = ({
    preorder,
    onFulfill,
    userData,
    isFulfilling,
}) => {
    const [preorderUser, setPreorderUser] = useState<User | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);

    const formattedDate = format(
        new Date(preorder.datetime),
        "MMM dd, yyyy HH:mm"
    );

    const hasEnoughBalance =
        userData && userData.voucherBal >= preorder.totalPrice;
    const hasEnoughStock =
        product && product.quantity >= preorder.qtyPreordered;
    const canFulfill = hasEnoughBalance && hasEnoughStock;

    useEffect(() => {
        const fetchPreorderUser = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/users/${preorder.userId}`
                );
                if (!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setPreorderUser(data);
            } catch (error) {
                console.error("Error fetching preorder user:", error);
            } finally {
                setIsLoadingUser(false);
            }
        };

        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/products/${preorder.productId}`
                );
                if (!response.ok)
                    throw new Error("Failed to fetch product data");
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoadingProduct(false);
            }
        };

        Promise.all([fetchPreorderUser(), fetchProduct()]);
    }, [preorder.userId, preorder.productId]);

    return (
        <Card
            className={`w-full ${
                preorder.status === "FULFILLED" ? "opacity-50" : ""
            }`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                    Preorder #{preorder.preorderId}
                </CardTitle>
                <Badge
                    variant={
                        preorder.status === "PENDING" ? "default" : "secondary"
                    }
                >
                    {preorder.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Ordered by:</span>
                        <span className="font-medium">
                            {isLoadingUser ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : preorderUser ? (
                                preorderUser.name
                            ) : (
                                "Unknown User"
                            )}
                        </span>
                        <span className="text-gray-500">Product:</span>
                        <span className="font-medium">
                            {isLoadingProduct ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : product ? (
                                product.name
                            ) : (
                                "Unknown Product"
                            )}
                        </span>
                        <span className="text-gray-500">Order Amount:</span>
                        <span className="font-medium">
                            ${preorder.totalPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-medium">
                            {preorder.qtyPreordered}
                        </span>
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{formattedDate}</span>
                    </div>

                    {preorder.status === "PENDING" && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full mt-4">
                                    View Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Preorder Details #{preorder.preorderId}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Review the preorder details before
                                        fulfilling
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <span className="font-medium">
                                            Ordered by:
                                        </span>
                                        <span>
                                            {isLoadingUser ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : preorderUser ? (
                                                preorderUser.name
                                            ) : (
                                                "Unknown User"
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            Product:
                                        </span>
                                        <span>
                                            {isLoadingProduct ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : product ? (
                                                product.name
                                            ) : (
                                                "Unknown Product"
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            Available Stock:
                                        </span>
                                        <span>
                                            {isLoadingProduct ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : product ? (
                                                product.quantity
                                            ) : (
                                                "Unknown"
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            Quantity:
                                        </span>
                                        <span>{preorder.qtyPreordered}</span>
                                        <span className="font-medium">
                                            Total Price:
                                        </span>
                                        <span>
                                            ${preorder.totalPrice.toFixed(2)}
                                        </span>
                                        <span className="font-medium">
                                            Order Date:
                                        </span>
                                        <span>{formattedDate}</span>
                                        {userData && (
                                            <>
                                                <span className="font-medium">
                                                    Your Balance:
                                                </span>
                                                <span>
                                                    $
                                                    {userData.voucherBal.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {!hasEnoughBalance && (
                                        <div className="text-red-500 text-sm">
                                            Insufficient voucher balance to
                                            fulfill this preorder
                                        </div>
                                    )}
                                    {!hasEnoughStock && (
                                        <div className="text-red-500 text-sm">
                                            Insufficient stock available to
                                            fulfill this preorder
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={() =>
                                            onFulfill(preorder.preorderId)
                                        }
                                        disabled={
                                            !canFulfill ||
                                            preorder.status !== "PENDING"
                                        }
                                    >
                                        {isFulfilling ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Fulfilling...
                                            </>
                                        ) : (
                                            "Fulfill Preorder"
                                        )}
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

export default PreorderCard;
