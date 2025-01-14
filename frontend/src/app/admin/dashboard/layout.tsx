"use client";

import { withSuspendedCheck } from "@/components/useCheckSuspended";

function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export default withSuspendedCheck(AdminLayout);
