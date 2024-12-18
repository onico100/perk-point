import { connectDatabase, getAllDocuments } from "@/services/mongo";
import { NextResponse } from "next/server";

export const fetchCache = "force-no-store"; // Ensures no caching

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

    // Setting Cache-Control header
    const response = NextResponse.json(benefits);
    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
