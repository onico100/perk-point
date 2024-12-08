"use server";
import { NextResponse } from "next/server";
import { connectDatabase, getDocumentById } from "@/services/mongo";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    let client;
    try {
        client = await connectDatabase();
        if (!client) {
            return NextResponse.json(
                { error: "Failed to connect to the database" },
                { status: 500 }
            );
        }
        const category = await getDocumentById(
            client,
            "categories_collection",
            params.id
        );
        if (!category) {
            return NextResponse.json(
                { error: "category not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(category);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        client?.close();
    }
}