import {
  connectDatabase,
  getDocumentByApiId,
  increasedocumentCounterById,
} from "@/services/mongo";
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
    } else {
      console.log("Connected to the database");
    }
    
    const data = await request.json();
    let collection = data.isAPI ? "benefits_api" : "benefits_collection";
    let id = params.id;

    if (data.isAPI) {
      let document = await getDocumentByApiId(client, "benefits_api", id);
      id = document._id;
    }
    client = await connectDatabase();
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }

    const result = await increasedocumentCounterById(client, collection, id, {
      $inc: { counter: 1 },
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Counter incremented successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error: unknown) {
    console.error("Error in PATCH request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
