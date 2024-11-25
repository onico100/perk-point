"use server";
import { NextResponse } from "next/server";
import { getAllDocuments, connectDatabase } from "@/services/mongo";

export async function GET(req: Request) {
    const client = await connectDatabase();

    try {
        const clubs = await getAllDocuments(client, "clubs_collection");
        return NextResponse.json(clubs);
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ message: "Failed to fetch documents" }, { status: 500 });
    } finally {
        await client.close();
    }
}
