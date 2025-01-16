import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const useCheckSuspended = () => {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const fetchUserStatus = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API}/users/${user.id}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch user data");
                    }
                    const data = await response.json();
                    setStatus(data.status);
                } catch (error) {
                    console.error("Error fetching user status:", error);
                }
            }
        };

        if (isLoaded && user) {
            fetchUserStatus();
        }
    }, [isLoaded, user]);

    useEffect(() => {
        if (isLoaded && status !== null) {
            const isSuspended = status === "SUSPENDED";
            if (isSuspended) {
                if (!window.location.pathname.includes("/suspended")) {
                    router.push("/suspended");
                }
            }
        }
    }, [isLoaded, status, user, router]);

    return { isLoaded };
};
