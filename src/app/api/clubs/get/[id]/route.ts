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
        const club = await getDocumentById(
            client,
            "clubs_collection",
            params.id
        );
        if (!club) {
            return NextResponse.json(
                { error: "club not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(club);
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        client?.close();
    }
}
