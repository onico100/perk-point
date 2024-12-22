import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.PUBLIC_DB_CONNECTION!;
const client = new MongoClient(uri);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const db = client.db("benefits-site");
        const collection = db.collection("contact_addClub_collection");

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isActive: false } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Add club not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Add club form marked as inactive" });
    } catch (error) {
        console.error("Error deleting Add club form:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
