"use server";
import { NextResponse } from "next/server";
import { getAllDocuments, connectDatabase } from "@/services/mongo";

export async function GET(req: Request) {
    const client = await connectDatabase();
    try {
        const categories = await getAllDocuments(client, "categories_collection");
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ message: "Failed to fetch documents" }, { status: 500 });
    } finally {
        await client.close();
    }
}
