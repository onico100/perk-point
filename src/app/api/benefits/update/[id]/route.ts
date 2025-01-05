import { connectDatabase, updateDocumentById } from "@/services/mongo";
import { benefitSchema } from "@/types/BenefitsTypes";
import { isActiveSchema, ValidationError } from "@/types/Generaltypes";
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
    const UpdateSchema = benefitSchema.partial();

    let dataToCheck = { ...data };
    if (data.hasOwnProperty("branches")) {
      dataToCheck.branches =
        data?.branches?.length > 0 ? [data.branches[0].city] : [];
    }

    const validationResult = UpdateSchema.safeParse(dataToCheck);
    const errors: ValidationError[] = [];

    if (!validationResult.success) {
      validationResult.error.errors.map((err) =>
        errors.push({
          field: err.path.join("."),
          message: err.message,
        })
      );
    }

    if (data.hasOwnProperty("isActive")) {
      const isActiveValidationResult = isActiveSchema.safeParse({
        isActive: data.isActive,
      });

      if (!isActiveValidationResult.success) {
        errors.push({
          field: "isActive",
          message: isActiveValidationResult.error.errors[0].message,
        });
      }
    }

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
