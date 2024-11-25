import { connectDatabase, getDocumentById } from "@/services/mongo";
import { NextResponse } from "next/server";

export async function GET(
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
    const benefit = await getDocumentById(
      client,
      "benefits_collection",
      params.id
    );
    if (!benefit) {
      return NextResponse.json(
        { error: "Benefit not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(benefit);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
