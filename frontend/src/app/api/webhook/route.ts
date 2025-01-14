// app/api/webhook/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Get the headers
    const headerPayload = headers();
    const svix_id = (await headerPayload).get("svix-id");
    const svix_timestamp = (await headerPayload).get("svix-timestamp");
    const svix_signature = (await headerPayload).get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(process.env.NEXT_PUBLIC_WEBHOOK_SECRET || "");

    let evt: WebhookEvent;

    // Verify the webhook
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

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, unsafe_metadata } = evt.data;
        const signUpRoute =
            unsafe_metadata && typeof unsafe_metadata === "object"
                ? (unsafe_metadata as { signUpRoute?: string }).signUpRoute
                : undefined;
        const role = determineUserRole(signUpRoute);

        try {
            const clerk = await clerkClient();
            // Update the user's metadata with their role
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
    }

    return NextResponse.json({ message: "Webhook received" });
}

function determineUserRole(
    signUpRoute: string | undefined
): "admin" | "resident" {
    // If the signup came from the resident route, assign resident role
    if (signUpRoute === "admin") {
        return "admin";
    }

    // Default to admin for admin route or if route is unknown
    // You might want to adjust this logic based on your needs
    return "resident";
}
