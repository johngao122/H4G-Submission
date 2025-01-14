"use client";

import { withSuspendedCheck } from "@/components/useCheckSuspended";

function ResidentLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export default withSuspendedCheck(ResidentLayout);
