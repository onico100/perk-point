import { connectDatabase, getAllDocuments } from "@/services/mongo";
import { NextResponse } from "next/server";

export async function POST() {
  let client;

  try {
    // Connect to the database
    client = await connectDatabase();
    if (!client) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    } else {
      console.log("Connected to the database");
    }

    // Create the object to insert into `logins_collection`
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      method: "GET",
    };

    // Insert the object into `logins_collection`
    const logCollection = client.db().collection("logins_collection");
    const insertResult = await logCollection.insertOne(logEntry);

    if (!insertResult.acknowledged) {
      return NextResponse.json(
        { error: "Failed to log the request" },
        { status: 500 }
      );
    }

    // Fetch documents from `benefits_collection`
    const benefits = await getAllDocuments(client, "benefits_collection");

    const response = {
      [timestamp]: "vdcd",
      data: benefits,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    // Close the database connection
    client?.close();
  }
}
