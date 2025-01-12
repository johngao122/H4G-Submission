import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { dark, neobrutalism } from "@clerk/themes";
import "@/app/globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider afterSignOutUrl={"/"}>
            <html lang="en">
                <body>{children}</body>
            </html>
        </ClerkProvider>
    );
}
