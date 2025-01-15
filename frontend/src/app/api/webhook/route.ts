import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
        const { id, first_name, last_name, unsafe_metadata } = evt.data;
        const signUpRoute =
            unsafe_metadata && typeof unsafe_metadata === "object"
                ? (unsafe_metadata as { signUpRoute?: string }).signUpRoute
                : undefined;
        const role = determineUserRole(signUpRoute);

        try {
            const clerk = await clerkClient();
            const metadata =
                role === "admin"
                    ? { role, suspended: false }
                    : { role, VoucherBalance: 0, suspended: false };

            await clerk.users.updateUser(id, {
                publicMetadata: metadata,
            });
            const apiResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/users`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: id,
                        name:
                            `${first_name || ""} ${last_name || ""}`.trim() ||
                            "User",
                        role: role,
                        voucherBal: role === "admin" ? undefined : 0,
                    }),
                }
            );

            if (!apiResponse.ok) {
                throw new Error("Failed to create user in backend API");
            }

            return NextResponse.json({
                message: "User created successfully",
                role,
            });
        } catch (error) {
            console.error("Error in user creation process:", error);
            return NextResponse.json(
                { error: "Error in user creation process" },
                { status: 500 }
            );
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
