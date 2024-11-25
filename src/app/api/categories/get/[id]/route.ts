"use server";
import { NextResponse } from "next/server";
import { connectDatabase, getDocumentById } from "@/services/mongo";

export async function GET(req: Request, { params }: { params: { id?: string } }) {
    const client = await connectDatabase();
    try {
        if (!params.id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }
        const category = await getDocumentById(client, "categories_collection", params.id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch category" }, { status: 500 });
    } finally {
        await client.close();
    }
}