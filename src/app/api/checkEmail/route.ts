import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/services/mongo";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const client = await connectDatabase();
    const db = client.db("benefits-site");

    const userExists = await db.collection("users").findOne({ email });
    const supplierExists = await db.collection("suppliers").findOne({ email });

    client.close();

    return NextResponse.json({ exists: userExists || supplierExists });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
