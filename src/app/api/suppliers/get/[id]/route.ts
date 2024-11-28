import { connectDatabase, getDocumentById } from "@/services/mongo";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("GET /api/suppliers/[id]");
  let client;
  try {
    client = await connectDatabase();
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }
    const supplier = await getDocumentById(
      client,
      "suppliers_collection",
      params.id
    );
    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(supplier);
  } catch (error: unknown) {
    // Ensure 'error' is safely handled
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
