import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md mx-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 rounded-full bg-red-100">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">
                            Access Denied
                        </h2>

                        <p className="text-gray-600 text-center mb-8">
                            You do not have permission to access the admin
                            portal. This area is restricted to administrators
                            only.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() =>
                                    router.push("/resident/dashboard")
                                }
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Go to Resident Dashboard
                            </button>

                            <button
                                onClick={handleSwitchAccount}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                            >
                                Switch Account
                            </button>
                        </div>
                    </div>
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
