type PreorderStatus = "PENDING" | "FULFILLED";
interface Preorder {
    preorderId: string;
    userId: string;
    productId: string;
    qtyPreordered: number;
    totalPrice: number;
    datetime: string;
    status: PreorderStatus;
}

interface User {
    userId: string;
    name: string;
    voucherBal: number;
    role: string;
    status: string;
}

interface PreorderCardProps {
    preorder: Preorder;
    onFulfill: (preorderId: string) => void;
    userData?: User;
    isFulfilling?: boolean;
}

export type { Preorder, User, PreorderCardProps };
