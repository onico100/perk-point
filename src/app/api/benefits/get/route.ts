import { connectDatabase, getAllDocuments } from "@/services/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  let client;
  try {
    client = await connectDatabase();
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    } else {
      console.log("Connected to the database");
    }
    const benefits = await getAllDocuments(client, "benefits_collection");
    return NextResponse.json(benefits);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
