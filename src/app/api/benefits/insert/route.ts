import { connectDatabase, insertDocument } from "@/services/mongo";
import { benefitSchema } from "@/types/BenefitsTypes";
import { ValidationError } from "@/types/Generaltypes";
import { NextResponse } from "next/server";

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
  
    let dataToCheck = { ...data }; 
    dataToCheck.branches = data?.branches?.length > 0 ? [data.branches[0].city] : [];
    
    const validationResult = benefitSchema.safeParse(dataToCheck);
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

      if (errors.length > 0)
        return NextResponse.json({ errors }, { status: 400 });


    const result = await insertDocument(client, "benefits_collection", data);
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
