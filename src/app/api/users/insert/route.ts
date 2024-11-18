import { NextResponse } from "next/server";
import { connectDatabase, insertDocument } from "@/Services/mongo";

export async function POST(request: Request) {
  const client = await connectDatabase();
  const data = await request.json();

  try {
    const result = await insertDocument(client, "users", data);
    console.log("Document inserted:", result);
    return NextResponse.json({ message: "Document inserted", user: result });
  } catch (error) {
    console.error("Error inserting document:", error);
    return NextResponse.json({ message: "Error inserting document", error });
  } finally {
    client.close();
  }
}
