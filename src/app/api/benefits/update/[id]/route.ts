import { connectDatabase, updateDocumentById } from "@/services/mongo";
import { NextResponse } from "next/server";

// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   let client;
//   try {
//     client = await connectDatabase();
//     if (!client) {
//       return NextResponse.json(
//         { error: "Failed to connect to the database" },
//         { status: 500 }
//       );
//     }
//     const data = await request.json();
//     const result = await updateDocumentById(
//       client,
//       "benefits_collection",
//       params.id,
//       data
//     );
//     if (result.matchedCount === 0) {
//       return NextResponse.json(
//         { error: "benefit not found" },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json({ modifiedCount: result.modifiedCount });
//   } catch (error: unknown) {
//     // Ensure 'error' is safely handled
//     const errorMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   } finally {
//     client?.close();
//   }
// }

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

    // Log incoming request data
    const data = await request.json();
    console.log("Updating benefit with ID:", params.id, "Data:", data);

    const result = await updateDocumentById(
      client,
      "benefits_collection",
      params.id,
      data
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Benefit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ modifiedCount: result.modifiedCount });
  } catch (error: unknown) {
    // Log the error for debugging
    console.error("Error in PATCH request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}