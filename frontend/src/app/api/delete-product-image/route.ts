import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const urlToDelete = searchParams.get("url");

        if (!urlToDelete) {
            return NextResponse.json(
                { error: "URL parameter is required" },
                { status: 400 }
            );
        }

        await del(urlToDelete);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting from Vercel Blob:", error);
        return NextResponse.json(
            { error: "Failed to delete file" },
            { status: 500 }
        );
    }
}
