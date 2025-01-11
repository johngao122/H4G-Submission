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
                <div className="mt-4 ">
                    <Link
                        href="/admin/forgotPassword"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        Forgot your password? Reset it here
                    </Link>
                </div>
            </div>
        </div>
    );
}
