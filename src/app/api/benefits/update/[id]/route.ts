import { connectDatabase, updateDocumentById } from "@/services/mongo";
import { benefitSchema } from "@/types/BenefitsTypes";
import { ValidationError } from "@/types/Generaltypes";
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

    let dataToCheck = { ...data };
    dataToCheck.branches =
      data?.branches?.length > 0 ? [data.branches[0].city] : [];

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

    const result = await updateDocumentById(
      client,
      "benefits_collection",
      params.id,
      data
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
    }

    return NextResponse.json({ modifiedCount: result.modifiedCount });
  } catch (error: unknown) {
    console.error("Error in PATCH request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
