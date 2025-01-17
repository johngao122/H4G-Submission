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
        const { id, first_name, last_name, unsafe_metadata, public_metadata } =
            evt.data;
        const signUpRoute =
            unsafe_metadata && typeof unsafe_metadata === "object"
                ? (unsafe_metadata as { signUpRoute?: string }).signUpRoute
                : undefined;
        const role = determineUserRole(signUpRoute);

        const voucherBalance =
            typeof public_metadata?.voucherBalance === "number"
                ? public_metadata.voucherBalance
                : Number(public_metadata?.voucherBalance) || 0;

        try {
            console.log("Sending to API:", {
                userId: id,
                name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
                role: role.toUpperCase(),
                voucherBal: voucherBalance,
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
                        role: role.toUpperCase(),
                        voucherBal: voucherBalance,
                    }),
                }
            );

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                console.error("API Error:", errorData);
                throw new Error(
                    `Failed to create user in backend API: ${JSON.stringify(
                        errorData
                    )}`
                );
            }

            const responseData = await apiResponse.json();
            console.log("API Response:", responseData);

            return NextResponse.json({
                message: "User created successfully",
                role,
                voucherBalance,
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
