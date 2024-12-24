import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.PUBLIC_DB_CONNECTION!;
const client = new MongoClient(uri);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { status } = await request.json();
        const db = client.db("benefits-site");
        const collection = db.collection("contact_addClub_collection");
        console.log("status: " + status);

        const result= status == "נדחה" ?  
            await collection.updateOne( { _id: new ObjectId(id) },  { $set: { status , isActive:false} },
        ) : await collection.updateOne( { _id: new ObjectId(id) },  { $set: { status: status },} )


        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Add club form not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Add club form status updated successfully" });
    } catch (error) {
        console.error("Error updating Add club form status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}