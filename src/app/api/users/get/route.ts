import { NextResponse } from "next/server";
import { connectDatabase, getAllDocuments } from "@/Services/mongo";

export async function GET() {
  const client = await connectDatabase();

  try {
    const documents = await getAllDocuments(client, "users");
    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching documents", error });
  } finally {
    client.close();
  }
}
