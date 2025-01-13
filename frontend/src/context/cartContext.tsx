"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/app/types/shop";
import { useAuth } from "@clerk/nextjs";

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (productId: string, quantity: number, product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { userId, isLoaded } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized && isLoaded) {
            const cartKey = userId ? `cart-${userId}` : "anonymous-cart";
            const savedCart = localStorage.getItem(cartKey);

            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(parsedCart);
                } catch (error) {
                    console.error("Error parsing cart data:", error);
                    localStorage.removeItem(cartKey);
                }
            }
            setIsInitialized(true);
        }
    }, [userId, isInitialized, isLoaded]);

    useEffect(() => {
        if (isInitialized && isLoaded) {
            const cartKey = userId ? `cart-${userId}` : "anonymous-cart";
            localStorage.setItem(cartKey, JSON.stringify(cartItems));
        }
    }, [cartItems, userId, isInitialized, isLoaded]);

    useEffect(() => {
        if (isLoaded && isInitialized) {
            const cartKey = userId ? `cart-${userId}` : "anonymous-cart";
            const savedCart = localStorage.getItem(cartKey);

            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(parsedCart);
                } catch (error) {
                    console.error("Error parsing cart data:", error);
                    localStorage.removeItem(cartKey);
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        }
    }, [userId, isLoaded, isInitialized]);

    const addToCart = (
        productId: string,
        quantity: number,
        product: Product
    ) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.id === productId
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [
                ...prevItems,
                {
                    id: productId,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    imageUrl: product.imageUrl,
                    description: product.description,
                },
            ];
        });
    };

    const removeFromCart = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== productId)
        );
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity === 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        const cartKey = userId ? `cart-${userId}` : "anonymous-cart";
        localStorage.removeItem(cartKey);
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
