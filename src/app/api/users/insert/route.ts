import bcrypt from "bcrypt";
import { connectDatabase, insertDocument } from "@/services/mongo";
import { NextResponse } from "next/server";
import { userGoogleSchema } from "@/types/Generaltypes";

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
    
    const validationResult = userGoogleSchema.safeParse(data);

    if (!validationResult.success) {
      const errors=validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }

    if (!data.password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const result = await insertDocument(client, "users_collection", data);
    const { password: _, ...userWithoutPassword } = data;

    return NextResponse.json(userWithoutPassword);


  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
