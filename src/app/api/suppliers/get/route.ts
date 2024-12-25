import { connectDatabase, getAllDocuments } from "@/services/mongo";
import { NextRequest, NextResponse } from "next/server";

let client = await connectDatabase();
export async function GET() {
  try { 
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    } else {
      console.log("Connected to the database");
    }
    const suppliers = await getAllDocuments(client, "suppliers_collection");
    return NextResponse.json(suppliers);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}




