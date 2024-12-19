import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.PUBLIC_DB_CONNECTION!;
const client = new MongoClient(uri);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const db = client.db("benefits-site");
    const collection = db.collection("contact_forms_collection");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Contact form not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Contact form marked as inactive" });
  } catch (error) {
    console.error("Error deleting contact form:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
