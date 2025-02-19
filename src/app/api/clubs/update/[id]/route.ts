import { connectDatabase, updateDocumentById } from "@/services/mongo";
import { ClubAnotherFieldsSchema, clubSchema } from "@/types/ClubTypes";
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
    let dataToCheck = {
      clubName: data?.clubName,
      clubLink: data?.clubLink,
      clubLogo: data?.clubLogo,
      email: "aaa@gmail.com",
    };

    const UpdateSchema = clubSchema.partial();

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


      let isActiveSchema2=isActiveSchema.partial()
      const isActiveValidationResult = isActiveSchema2.safeParse({
        isActive: data.isActive,
      });

      if (!isActiveValidationResult.success) {
        errors.push({
          field: "isActive",
          message: isActiveValidationResult.error.errors[0].message,
        });
      }


    let ClubAnotherFieldsSchema2=ClubAnotherFieldsSchema.partial();
      const ClubAnotherFieldsSchemaValidationResult = ClubAnotherFieldsSchema2.safeParse({
        APIData: data.APIData,
        clubStatus: data.clubStatus
      });

      if (!ClubAnotherFieldsSchemaValidationResult.success) {
        ClubAnotherFieldsSchemaValidationResult.error.errors.map((err) =>
          errors.push({
            field: err.path.join("."),
            message: err.message,
          })
        );
      }

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

    return NextResponse.json({
      modifiedCount: result.modifiedCount,
      result: result,
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
