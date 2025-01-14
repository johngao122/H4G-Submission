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
    onDeleteProduct: (id: string) => void;
    onUpdateProduct: (product: Product) => void;
}

export type { ShopItemProps, Product, CartItem, ProductTableProps };
