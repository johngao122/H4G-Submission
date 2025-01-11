import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useRoleCheck(requiredRole: "admin" | "resident") {
    const { userId } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkRole() {
            if (!userId) {
                router.push(`/${requiredRole}/login`);
                return;
            }

            try {
                const response = await fetch("/api/auth/check-role", {
                    headers: {
                        "X-User-Id": userId,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch role");
                }

                const { role } = await response.json();

                if (role !== requiredRole) {
                    router.push(
                        role === "admin"
                            ? "/admin/dashboard"
                            : "/resident/dashboard"
                    );
                }
            } catch (error) {
                console.error("Error checking role:", error);
                router.push(`/${requiredRole}/login`);
            } finally {
                setIsLoading(false);
            }
        }

        checkRole();
    }, [userId, requiredRole, router]);

    return { isLoading };
}
