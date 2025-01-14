import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ShoppingCart, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ShopItem from "./shopItem";
import { useRouter } from "next/navigation";
import { Product } from "@/app/types/shop";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Product 1",
        description: "Description of Product 1",
        price: 19.99,
        imageUrl: "/api/placeholder/300/200",
        Category: "Category 1",
        quantity: 200,
    },
    {
        id: "2",
        name: "Product 2",
        description: "Description of Product 2",
        price: 29.99,
        imageUrl: "/api/placeholder/300/200",
        Category: "Category 2",
        quantity: 100,
    },
    {
        id: "3",
        name: "Product 3",
        description: "Description of Product 3",
        price: 39.99,
        imageUrl: "/api/placeholder/300/200",
        Category: "Category 3",
        quantity: 0,
    },
];

const Shop: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredProducts, setFilteredProducts] =
        useState<Product[]>(SAMPLE_PRODUCTS);
    const { totalItems, addToCart } = useCart();

    // Get unique categories from products
    const categories = [
        "all",
        ...new Set(SAMPLE_PRODUCTS.map((product) => product.Category)),
    ];

    useEffect(() => {
        const filtered = SAMPLE_PRODUCTS.filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === "all" ||
                product.Category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
        setFilteredProducts(filtered);
    }, [searchQuery, selectedCategory]);

    const handleAddToCart = (productId: string, quantity: number) => {
        const productToAdd = SAMPLE_PRODUCTS.find((p) => p.id === productId);
        if (!productToAdd || productToAdd.quantity === 0) {
            toast({
                title: "Error",
                description: "Product is out of stock",
                variant: "destructive",
            });
            return;
        }

        if (quantity > productToAdd.quantity) {
            toast({
                title: "Error",
                description: "Not enough stock available",
                variant: "destructive",
            });
            return;
        }

        addToCart(productId, quantity, productToAdd);
        toast({
            title: "Success",
            description: `${productToAdd.name} added to cart`,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={() =>
                            router.push("/resident/dashboard/shop/cart")
                        }
                        className="relative"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <ShopItem
                        key={product.id}
                        {...product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No products found matching your criteria
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
