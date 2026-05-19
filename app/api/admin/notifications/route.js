import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import ContactSubmission from "@/lib/models/ContactSubmission";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDb();
    const submissions = await ContactSubmission.find({}).sort({ createdAt: -1 }).lean();
    
    const serialized = submissions.map(sub => ({
      ...sub,
      _id: sub._id.toString(),
      createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : sub.createdAt,
      updatedAt: sub.updatedAt instanceof Date ? sub.updatedAt.toISOString() : sub.updatedAt
    }));

    return NextResponse.json({ submissions: serialized });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id, markAllRead } = await request.json();
    await connectDb();

    if (markAllRead) {
      await ContactSubmission.updateMany({ isRead: false }, { isRead: true });
      return NextResponse.json({ success: true, message: "All marked as read" });
    }

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const updated = await ContactSubmission.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      notification: {
        ...updated.toObject(),
        _id: updated._id.toString(),
      }
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ message: "Failed to update notification" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    await connectDb();
    const deleted = await ContactSubmission.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Notification not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ message: "Failed to delete notification" }, { status: 500 });
  }
}
