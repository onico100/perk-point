import bcrypt from "bcrypt";
import {
  connectDatabase,
} from "@/services/mongo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let client;
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Both email and password are required" },
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
    const supplier = await db.collection("suppliers_collection").findOne({ email });

    if (!supplier) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 404 }
      );
    }


    const passwordMatch = await bcrypt.compare(password, supplier.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }


    const { password: _, ...supplierWithoutPassword } = supplier;
    return NextResponse.json(supplierWithoutPassword, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
