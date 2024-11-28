import {
  connectDatabase,
  getClientModeByEmailAndPassword,
} from "@/services/mongo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let client;
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password } = body;
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Both name and password are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    client = await connectDatabase();
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }

    // Find the supplier
    const supplier = await getClientModeByEmailAndPassword(
      client,
      "suppliers_collection",
      email,
      password,
    );

    if (!supplier) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 404 }
      );
    }

    // Return the supplier
    return NextResponse.json(supplier, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
