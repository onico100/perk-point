import { connectDatabase, insertDocument } from "@/services/mongo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let client;
  try {
    client = await connectDatabase();
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }
    const data = await request.json();
    const result = await insertDocument(client, "users_collection", data);
    return NextResponse.json(data);
  } catch (error: unknown) {
    // Ensure 'error' is safely handled
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
