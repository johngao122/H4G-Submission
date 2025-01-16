import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

interface UserInfo {
    userId: string;
    name: string;
    voucherBal: number;
    role: "ADMIN" | "RESIDENT";
    status: "ACTIVE" | "INACTIVE";
}

export function useAdminAuth() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const router = useRouter();
    const { signOut } = useClerk();

    useEffect(() => {
        const checkUserRole = async () => {
            if (isLoaded && user) {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API}/users/${user.id}`
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch user info");
                    }

                    const userData: UserInfo = await response.json();
                    setUserInfo(userData);

                    if (
                        userData.role === "ADMIN" &&
                        userData.status === "ACTIVE"
                    ) {
                        setIsAuthorized(true);
                    } else {
                        setIsAuthorized(false);
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setIsAuthorized(false);
                } finally {
                    setIsChecking(false);
                }
            } else if (isLoaded && !user) {
                setIsChecking(false);
                setIsAuthorized(false);
            }
        };

        checkUserRole();
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
                            {userInfo?.status === "INACTIVE"
                                ? "Your account is currently inactive. Please contact an administrator."
                                : "You do not have permission to access the admin portal. This area is restricted to administrators only."}
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
        userInfo,
    };
}
