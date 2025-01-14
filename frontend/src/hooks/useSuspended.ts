import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const useCheckSuspended = () => {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && user) {
            const isSuspended = user.publicMetadata.suspended === true;
            if (isSuspended) {
                if (!window.location.pathname.includes("/suspended")) {
                    router.push("/suspended");
                }
            } else {
                if (window.location.pathname.includes("/suspended")) {
                    const isAdmin = user.publicMetadata.role === "ADMIN";
                    router.push(
                        isAdmin ? "/admin/dashboard" : "/resident/dashboard"
                    );
                }
            }
        }
    }, [isLoaded, user, router]);

    return { isLoaded };
};
