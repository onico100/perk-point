import { connectDatabase, insertDocument } from "@/services/mongo";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supplierSchema } from "@/types/SupplierTypes";
import { isActiveSchema, ValidationError } from "@/types/Generaltypes";

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
    dataToCheck.branches =
      data?.branches?.length > 0 ? [data.branches[0].city] : [];

    const validationResult = supplierSchema.safeParse(dataToCheck);
    const errors: ValidationError[] = [];

    if (!validationResult.success) {
      validationResult.error.errors.map((err) => (errors.push({
        field: err.path.join("."),
        message: err.message,
      })));
    }

      if (errors.length > 0)
        return NextResponse.json({ errors }, { status: 400 });


    const { email, password, providerName, businessName, phoneNumber } = data;
    if (!email || !password || !providerName || !businessName || !phoneNumber) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSupplier = {
      ...data,
      password: hashedPassword, 
      selectedCategories: data.selectedCategories || [],
      registrationDate: new Date().toISOString(),
      isActive: true,
    };


    const result = await insertDocument(
      client,
      "suppliers_collection",
      newSupplier
    );

    const { password: _, ...supplierWithoutPassword } = newSupplier;

    return NextResponse.json(supplierWithoutPassword);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    client?.close();
  }
}
