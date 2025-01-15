import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    request: Request,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId: authUserId } = await auth();
        if (!authUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const params = await context.params;
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(params.userId);

        return NextResponse.json({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumbers: user.phoneNumbers.map((p) => p.phoneNumber),
            publicMetadata: {
                role:
                    (user.publicMetadata.role as "admin" | "resident") ||
                    "resident",
                voucherBalance:
                    (user.publicMetadata.voucherBalance as number) || 0,
                suspended: user.publicMetadata.suspended || false,
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
export async function PATCH(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId: authUserId } = await auth();
        if (!authUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await request.json();
        const clerk = await clerkClient();

        // Update basic user information
        const updateData: any = {};
        if (data.firstName) updateData.firstName = data.firstName;
        if (data.lastName) updateData.lastName = data.lastName;
        if (data.username) updateData.username = data.username;
        if (data.password) updateData.password = data.password;

        await clerk.users.updateUser(params.userId, updateData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
