import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.PUBLIC_DB_CONNECTION!;
const client = new MongoClient(uri);

export async function POST() {
  try {
    const db = client.db("benefits-site");
    const collection = db.collection("contact_forms_collection");

    const forms = await collection.find({ isActive: true }).toArray();
    return NextResponse.json({ data: forms });
  } catch (error) {
    console.error("Error fetching contact forms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
