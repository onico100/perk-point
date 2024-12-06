import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDatabase } from "@/services/mongo";

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword, role } = await request.json();

    if (!email || !newPassword || !role) {
      return NextResponse.json(
        { message: "Email, new password, and role are required" },
        { status: 400 }
      );
    }

    const client = await connectDatabase();
    const db = client.db("benefits-site");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const collectionName =
      role === "user" ? "users_collection" : "suppliers_collection";

    const result = await db.collection(collectionName).updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Email not found in the specified role" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
