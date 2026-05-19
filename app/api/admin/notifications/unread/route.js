import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import ContactSubmission from "@/lib/models/ContactSubmission";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDb();
    const count = await ContactSubmission.countDocuments({ isRead: false });
    
    // Also return the most recent notification ID and title to check if a new one arrived
    const latest = await ContactSubmission.findOne({ isRead: false }).sort({ createdAt: -1 }).select("_id name subject").lean();

    return NextResponse.json({ 
      count, 
      latest: latest ? {
        _id: latest._id.toString(),
        name: latest.name,
        subject: latest.subject
      } : null 
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json({ message: "Failed to fetch unread count" }, { status: 500 });
  }
}
