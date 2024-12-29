import { connectDatabase, updateDocumentById } from "@/services/mongo";
import { clubSchema } from "@/types/ClubTypes";
import { NextResponse } from "next/server";

interface ValidationError {
  field: string;
  message: string;
}

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
console.log(data)
        let dataToCheck = {
          clubName: data?.clubName,
          clubLink: data?.clubLink,
          clubLogo: data?.clubLogo,
          email: "aaa@gmail.com",
        };
    
        const validationResult = clubSchema.safeParse(dataToCheck);
        const errors: ValidationError[] = [];
    
        if (!validationResult.success) {
          validationResult.error.errors.map((err) => (errors.push({
            field: err.path.join("."),
            message: err.message,
          })));
        }
    
        if (data.isActive== null)
          errors.push({
            field: "isActive",
            message: "is active is required",
          });
    
        if (data.APIData == null)
          errors.push({
            field: "APIData",
            message: "API data is required",
          });
    
        if (data.clubStatus==null)
          errors.push({
            field: "clubStatus",
            message: "club status is required",
          });
    
        if (errors.length > 0)
          return NextResponse.json({ errors }, { status: 400 });

    const result = await updateDocumentById(
      client,
      "clubs_collection",
      params.id,
      data
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
    }

    return NextResponse.json({ modifiedCount: result.modifiedCount , result: result} );
  } catch (error: unknown) {
    console.error("Error in PATCH request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}