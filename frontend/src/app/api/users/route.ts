import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import VoucherBalance from "@/components/voucherBalance";

export async function GET() {
    try {
        const clerk = await clerkClient();
        const userList = await clerk.users.getUserList();

        const transformedUsers = userList.data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role:
                (user.publicMetadata.role as "admin" | "resident") ||
                "resident",
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

            case "UPDATE_METADATA":
                if (!data) {
                    return NextResponse.json(
                        {
                            error: "Data is required for UPDATE_METADATA action",
                        },
                        { status: 400 }
                    );
                }

                updateData = {
                    ...updateData,
                    role: data.role || updateData.role,
                    suspended: data.suspended ?? updateData.suspended,
                    voucherBalance:
                        data.voucherBalance ?? updateData.voucherBalance,
                };
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

        if (
            data?.firstName ||
            data?.lastName ||
            data?.username ||
            data?.password
        ) {
            const userUpdateData: any = {};
            if (data.firstName) userUpdateData.firstName = data.firstName;
            if (data.lastName) userUpdateData.lastName = data.lastName;
            if (data.username) userUpdateData.username = data.username;
            if (data.password) userUpdateData.password = data.password;

            await clerk.users.updateUser(userId, userUpdateData);
        }

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
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const userIdToDelete = url.pathname.split("/").pop();

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

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await request.json();
        const { name, phoneNumber, username, password, role, voucherBal } =
            data;

        const client = await clerkClient();

        const nameParts = name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        const numericVoucherBal = Number(voucherBal) || 0;
        console.log(numericVoucherBal);

        const publicMetadata = {
            role: role,
            voucherBalance: role === "resident" ? numericVoucherBal : 0,
            suspended: false,
        };

        const unsafeMetadata = {
            signUpRoute: role,
            initialVoucherBalance: numericVoucherBal,
        };

        const user = await client.users.createUser({
            username,
            password,
            firstName,
            lastName,
            phoneNumber: [phoneNumber],
            publicMetadata,
            unsafeMetadata,
            skipPasswordChecks: true,
            skipPasswordRequirement: true,
        });

        return NextResponse.json({
            message: "User created",
            user,
        });
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error.clerkError) {
            return NextResponse.json(
                { error: error.errors?.[0]?.longMessage || "Clerk API Error" },
                { status: 422 }
            );
        }
        return NextResponse.json(
            { error: "Error creating user" },
            { status: 500 }
        );
    }
}
