import { connectDatabase, updateDocumentById } from "@/services/mongo";
import { isActiveSchema, ValidationError } from "@/types/Generaltypes";
import { supplierSchema } from "@/types/SupplierTypes";
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

    const UpdateSchema = supplierSchema.partial();
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

    if (data.registrationDate == null || typeof data.registrationDate != "string")
      errors.push({
        field: "registrationDate",
        message: "registration date is required and must be a string",
      });

      const isActiveValidationResult = isActiveSchema.safeParse({
        isActive: data.isActive,
      });
      
      if (!isActiveValidationResult.success) {
        errors.push({
          field: "isActive",
          message: isActiveValidationResult.error.errors[0].message,
        });
      }

    if (errors.length > 0)
      return NextResponse.json({ errors }, { status: 400 });

    const result = await updateDocumentById(
      client,
      "suppliers_collection",
      params.id,
      data
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ modifiedCount: result.modifiedCount });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
