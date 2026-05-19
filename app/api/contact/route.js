import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import ContactSubmission from "@/lib/models/ContactSubmission";

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    await connectDb();
    
    const submission = await ContactSubmission.create({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json({ error: "Failed to submit contact form." }, { status: 500 });
  }
}
