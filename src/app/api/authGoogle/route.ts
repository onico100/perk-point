import bcrypt from "bcrypt";
import { connectDatabase, insertDocument } from "@/services/mongo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let client;

  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing email or name" },
        { status: 400 }
      );
    }

    client = await connectDatabase();
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }

    const db = client.db("benefits-site");

    const existingUser = await db.collection("users_collection").findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: true, user: existingUser },
        { status: 200 }
      );
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = { email, name, password: hashedPassword };
    const result = await insertDocument(client, "users_collection", newUser);

    return NextResponse.json({ success: true, user: result }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
