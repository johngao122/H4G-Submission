import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const clerk = await clerkClient();
        const userList = await clerk.users.getUserList();

        const transformedUsers = userList.data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role:
                (user.publicMetadata.role as "Admin" | "Resident") ||
                "Resident",
            voucherBalance: (user.publicMetadata.voucherBalance as number) || 0,
            status: user.publicMetadata.suspended ? "SUSPENDED" : "ACTIVE",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        return NextResponse.json({ users: transformedUsers });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const clerk = await clerkClient();
        const { userId, action, data } = await req.json();

        if (!userId || !action) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const user = await clerk.users.getUser(userId);
        const currentMetadata = user.publicMetadata;

        let updateData = { ...currentMetadata };

        switch (action) {
            case "SUSPEND":
                updateData.suspended = true;
                break;

            case "ACTIVATE":
                updateData.suspended = false;
                break;

            case "UPDATE_ROLE":
                if (!data?.role) {
                    return NextResponse.json(
                        { error: "Role is required for UPDATE_ROLE action" },
                        { status: 400 }
                    );
                }
                updateData.role = data.role;
                break;

            case "UPDATE_BALANCE":
                if (data?.voucherBalance === undefined) {
                    return NextResponse.json(
                        {
                            error: "Voucher balance is required for UPDATE_BALANCE action",
                        },
                        { status: 400 }
                    );
                }
                updateData.voucherBalance = data.voucherBalance;
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }

        await clerk.users.updateUser(userId, {
            publicMetadata: updateData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const clerk = await clerkClient();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        await clerk.users.deleteUser(userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
