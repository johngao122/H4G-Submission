import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();
    const { signOut } = useClerk();

    useEffect(() => {
        if (isLoaded && user) {
            const userRole = user.publicMetadata?.role;
            if (userRole !== "admin") {
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
            setIsChecking(false);
        }
    }, [isLoaded, user]);

    const handleSwitchAccount = async () => {
        try {
            await signOut();
            router.push("/admin/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const AccessDenied = () => (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <div className="text-center mb-6">
                    <svg
                        className="mx-auto h-12 w-12 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
                    Access Denied
                </h1>

                <p className="text-gray-600 mb-6 text-center">
                    You do not have permission to access the admin portal. This
                    area is restricted to administrators only.
                </p>

                <div className="space-y-4">
                    <a
                        href="/resident/dashboard"
                        className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Go to Resident Dashboard
                    </a>

                    <button
                        onClick={handleSwitchAccount}
                        className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Switch Account
                    </button>
                </div>
            </div>
        </div>
    );

    return {
        isAuthorized,
        isChecking,
        AccessDenied,
        user,
    };
}
