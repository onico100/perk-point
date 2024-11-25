"use server";
import { NextResponse } from "next/server";
import { connectDatabase, getDocumentById } from "@/services/mongo";

export async function GET(req: Request, { params }: { params: { id?: string } }) {
    console.log("hey")
    const client = await connectDatabase();
    try {
        if (!params.id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }
        console.log(params.id)
        const club = await getDocumentById(client, "clubs_collection", params.id);
        console.log(club)

        if (!club) {
            return NextResponse.json({ message: "Club not found" }, { status: 404 });
        }
        return NextResponse.json(club);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch club" }, { status: 500 });
    } finally {
        await client.close();
    }
}