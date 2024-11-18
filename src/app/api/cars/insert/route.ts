import { NextResponse } from "next/server";
import { connectDatabase, insertDocument } from "@/Services/mongo";

export async function POST(request: Request) {
  const client = await connectDatabase();
  const data = await request.json();

  try {
    const result = await insertDocument(client, "cars", data);
    return NextResponse.json({ message: "Document inserted", result });
  } catch (error) {
    return NextResponse.json({ message: "Error inserting document", error });
  } finally {
    client.close();
  }
}
