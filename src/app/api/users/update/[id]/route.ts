import { connectDatabase, updateDocumentById } from "@/services/mongo";
import { userGoogleSchema } from "@/types/Generaltypes";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const result = await updateDocumentById(
      client,
      "users_collection",
      params.id,
      data
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ modifiedCount: result.modifiedCount });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
