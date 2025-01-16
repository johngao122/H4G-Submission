interface ShopItemProps {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
    onAddToCart: (id: string, quantity: number) => void;
    Category: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
    Category: string;
}
interface CartItem extends Product {
    quantity: number;
}

interface ProductTableProps {
    products: Product[];
    onDeleteProduct: (id: string) => Promise<void>;
    onBulkDelete: (productIds: string[]) => Promise<void>;
    isDeleting: boolean;
}

export type { ShopItemProps, Product, CartItem, ProductTableProps };
