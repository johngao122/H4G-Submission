import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const productId = formData.get("productId") as string;

        if (!file || !productId) {
            return NextResponse.json(
                { error: "File and productId are required" },
                { status: 400 }
            );
        }

        const timestamp = Date.now();
        const fileExtension = file.name.split(".").pop();
        const filename = `products/${productId}_${timestamp}.${fileExtension}`;

        const blob = await put(filename, file, {
            access: "public",
            addRandomSuffix: false,
        });

        return NextResponse.json({ photoUrl: blob.url });
    } catch (error) {
        console.error("Error uploading to Vercel Blob:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
