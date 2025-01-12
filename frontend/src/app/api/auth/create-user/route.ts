import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const userData = await request.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}
