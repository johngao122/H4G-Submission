import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const clerk = await clerkClient();
        const { userId: authUserId } = await auth();
        if (!authUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await clerk.users.getUser((await params).userId);

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
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const clerk = await clerkClient();
        const { userId: authUserId } = await auth();
        if (!authUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await request.json();

        const authUser = await clerk.users.getUser(authUserId);
        const isAdmin = authUser.publicMetadata.role === "admin";

        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized: Admin access required" },
                { status: 403 }
            );
        }

        const updateData: Record<string, any> = {};
        if (data.firstName) updateData.firstName = data.firstName;
        if (data.lastName) updateData.lastName = data.lastName;
        if (data.username) updateData.username = data.username;
        if (data.password) updateData.password = data.password;

        if (
            data.role ||
            data.voucherBalance !== undefined ||
            data.suspended !== undefined
        ) {
            const publicMetadata = {
                ...(await clerk.users.getUser((await params).userId))
                    .publicMetadata,
                ...(data.role && { role: data.role }),
                ...(data.voucherBalance !== undefined && {
                    voucherBalance: data.voucherBalance,
                }),
                ...(data.suspended !== undefined && {
                    suspended: data.suspended,
                }),
            };
            updateData.publicMetadata = publicMetadata;
        }

        await clerk.users.updateUser((await params).userId, updateData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const clerk = await clerkClient();
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userIdToDelete = (await params).userId;

        if (!userIdToDelete) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        await clerk.users.deleteUser(userIdToDelete);

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
