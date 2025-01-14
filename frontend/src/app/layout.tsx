import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { CartProvider } from "@/context/cartContext";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ClerkProvider afterSignOutUrl={"/"}>
                    <CartProvider>
                        {children}
                        <Toaster />
                    </CartProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
