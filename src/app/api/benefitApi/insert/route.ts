import { connectDatabase, insertDocument } from "@/services/mongo";
import { benefitApiSchema } from "@/types/BenefitsTypes";
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

        const validationResult = benefitApiSchema.safeParse(data);

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err => ({
                field: err.path.join("."),
                message: err.message,
            }));
            return NextResponse.json({ errors }, { status: 400 });
        }
        
        const result = await insertDocument(client, "benefits_api", data);
        return NextResponse.json({ insertedId: result.insertedId });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        client?.close();
    }
}
