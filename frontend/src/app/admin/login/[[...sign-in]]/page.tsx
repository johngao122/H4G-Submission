"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md flex flex-col">
                <SignIn
                    fallbackRedirectUrl={"/admin/dashboard"}
                    appearance={{
                        elements: {
                            footerAction: { display: "none" },
                        },
                    }}
                />
            </div>
        </div>
    );
}
