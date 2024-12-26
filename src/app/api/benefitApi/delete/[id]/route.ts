import { connectDatabase, deleteDocumentById } from "@/services/mongo";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    let client;
    try {
        client = await connectDatabase();
        if (!client) {
            return NextResponse.json( { error: "Failed to connect to the database" },{ status: 500 });
        }
        const result = await deleteDocumentById(client,"benefits_api", params.id);
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Benefit not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
        client?.close();
    }
}
