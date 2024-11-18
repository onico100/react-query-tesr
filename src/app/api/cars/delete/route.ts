import { NextResponse } from "next/server";
import { connectDatabase, deleteDocument } from "@/Services/mongo";

export async function DELETE(request: Request) {
  const client = await connectDatabase();

  try {
    // Get the document ID from the request URL or body
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });
    }

    const result = await deleteDocument(client, "cars", id);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting document", error },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
