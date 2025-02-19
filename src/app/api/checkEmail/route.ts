import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/services/mongo";

export async function POST(request: NextRequest) {
  let client;
  try {
    client = await connectDatabase(); 
    const db = client.db("benefits-site"); 
    const { emailToSend } = await request.json();

    if (!emailToSend) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const userExists = await db.collection("users_collection").findOne({ email: emailToSend });
    const supplierExists = await db.collection("suppliers_collection").findOne({ email: emailToSend });

    return NextResponse.json({ exists: !!userExists || !!supplierExists , user: userExists || supplierExists });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client?.close(); 
  }
}
