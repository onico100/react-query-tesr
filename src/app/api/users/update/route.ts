import { NextResponse } from "next/server";
import { connectDatabase, updateDocument } from "@/Services/mongo";

export async function PATCH(request: Request) {
  const client = await connectDatabase();

  try {
    // Parse the request body for ID and document data
    const body = await request.json();
    const { id, ...document } = body;

    if (!id) {
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });
    }

    const result = await updateDocument(client, "users", id, document);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Document updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating document", error },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
