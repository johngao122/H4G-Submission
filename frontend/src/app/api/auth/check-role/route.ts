import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const userId = request.headers.get("X-User-Id");

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/role/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch user role");
        }
        const data = await response.json();
        return NextResponse.json({ role: data.role });
    } catch (error) {
        console.error("Error fetching role:", error);
        return NextResponse.json(
            { error: "Failed to fetch role" },
            { status: 500 }
        );
    }
}
