interface ShopItemProps {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
    onAddToCart: (id: string, quantity: number) => void;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
}
interface CartItem extends Product {
    quantity: number;
}

export type { ShopItemProps, Product, CartItem };
