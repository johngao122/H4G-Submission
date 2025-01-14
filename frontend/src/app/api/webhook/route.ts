import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import VoucherBalance from "@/components/voucherBalance";

export async function POST(req: Request) {
    const headerPayload = headers();
    const svix_id = (await headerPayload).get("svix-id");
    const svix_timestamp = (await headerPayload).get("svix-timestamp");
    const svix_signature = (await headerPayload).get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(process.env.NEXT_PUBLIC_WEBHOOK_SECRET || "");

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, unsafe_metadata } = evt.data;
        const signUpRoute =
            unsafe_metadata && typeof unsafe_metadata === "object"
                ? (unsafe_metadata as { signUpRoute?: string }).signUpRoute
                : undefined;
        const role = determineUserRole(signUpRoute);
        if (role === "admin") {
            try {
                const clerk = await clerkClient();
                await clerk.users.updateUser(id, {
                    publicMetadata: { role },
                });

                console.log(clerk.users.getUser(id));

                return NextResponse.json({
                    message: "User role set successfully",
                    role,
                });
            } catch (error) {
                console.error("Error updating user metadata:", error);
                return NextResponse.json(
                    { error: "Error updating user metadata" },
                    { status: 500 }
                );
            }
        } else {
            try {
                const clerk = await clerkClient();
                await clerk.users.updateUser(id, {
                    publicMetadata: { role, VoucherBalance: 0 },
                });

                console.log(clerk.users.getUser(id));

                return NextResponse.json({
                    message: "User role set successfully",
                    role,
                });
            } catch (error) {
                console.error("Error updating user metadata:", error);
                return NextResponse.json(
                    { error: "Error updating user metadata" },
                    { status: 500 }
                );
            }
        }
    }

    return NextResponse.json({ message: "Webhook received" });
}

function determineUserRole(
    signUpRoute: string | undefined
): "admin" | "resident" {
    if (signUpRoute === "admin") {
        return "admin";
    }

    return "resident";
}
