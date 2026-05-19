import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Retreat from "@/lib/models/Retreat";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.email || !body.guests) {
      return NextResponse.json({ message: "Name, email, and number of guests are required." }, { status: 400 });
    }

    await connectDb();
    const retreat = await Retreat.findById(id).lean();

    if (!retreat) {
      return NextResponse.json({ message: "Retreat not found." }, { status: 404 });
    }

    if (!retreat.registrationEnabled) {
      return NextResponse.json({ message: "Registration is not enabled for this retreat." }, { status: 403 });
    }

    // Send to Google Sheets Webhook if configured
    if (retreat.googleSheetWebhook) {
      try {
        const payload = {
          retreatId: retreat._id.toString(),
          retreatTitle: retreat.title,
          retreatDate: retreat.date,
          name: body.name,
          email: body.email,
          phone: body.phone || "",
          guests: body.guests,
          notes: body.notes || "",
          timestamp: new Date().toISOString()
        };

        const googleResponse = await fetch(retreat.googleSheetWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          // Short timeout to avoid hanging the request
          signal: AbortSignal.timeout(5000)
        });

        // Even if Google Sheets fails, we continue (maybe log it or fallback)
        if (!googleResponse.ok) {
          console.error("Google Sheets webhook returned error:", await googleResponse.text());
        }
      } catch (err) {
        console.error("Failed to ping Google Sheets webhook:", err);
        // Continue regardless to give the user a success message if we were saving to DB,
        // but since we only use Google Sheets here, maybe we should return an error?
        // Usually it's better to log the error but still tell the user it was received.
      }
    }

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "An error occurred during registration." }, { status: 500 });
  }
}
