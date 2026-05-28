import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import ContactSubmission from "@/lib/models/ContactSubmission";
import { getAdminFromRequest } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";
import { sendReplyEmail } from "@/lib/notificationChannels";

function serializeSubmission(sub) {
  return {
    ...sub,
    _id: sub._id.toString(),
    createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : sub.createdAt,
    updatedAt: sub.updatedAt instanceof Date ? sub.updatedAt.toISOString() : sub.updatedAt,
    replies: (sub.replies || []).map((reply) => ({
      ...reply,
      _id: reply._id?.toString?.(),
      sentAt: reply.sentAt instanceof Date ? reply.sentAt.toISOString() : reply.sentAt
    }))
  };
}

export async function GET(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "active";
    const search = searchParams.get("search") || "";
    const query = {};

    if (filter === "unread") {
      query.isRead = false;
      query.isArchived = { $ne: true };
    } else if (filter === "archived") {
      query.isArchived = true;
    } else {
      query.isArchived = { $ne: true };
    }

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
        { subject: { $regex: search.trim(), $options: "i" } },
        { message: { $regex: search.trim(), $options: "i" } }
      ];
    }

    await connectDb();
    const [submissions, total, unread, archived] = await Promise.all([
      ContactSubmission.find(query).sort({ createdAt: -1 }).limit(100).lean(),
      ContactSubmission.countDocuments({}),
      ContactSubmission.countDocuments({ isRead: false, isArchived: { $ne: true } }),
      ContactSubmission.countDocuments({ isArchived: true })
    ]);

    return NextResponse.json({ submissions: submissions.map(serializeSubmission), totals: { total, unread, archived } });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id, action, markAllRead, replyBody } = await request.json();
    await connectDb();

    if (markAllRead || action === "markAllRead") {
      await ContactSubmission.updateMany({ isRead: false, isArchived: { $ne: true } }, { isRead: true, status: "read" });
      return NextResponse.json({ success: true, message: "All marked as read" });
    }

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    let update = { isRead: true, status: "read" };

    if (action === "unread") update = { isRead: false, status: "new" };
    if (action === "archive") update = { isArchived: true, isRead: true, status: "archived" };
    if (action === "unarchive") update = { isArchived: false, status: "read" };

    if (action === "reply") {
      const body = String(replyBody || "").trim();
      if (body.length < 3) {
        return NextResponse.json({ message: "Reply message is required." }, { status: 400 });
      }

      const submission = await ContactSubmission.findById(id);
      if (!submission) return NextResponse.json({ message: "Notification not found" }, { status: 404 });

      const settings = await getSiteSettings();
      const emailResult = await sendReplyEmail({ submission, body, adminEmail: admin.email, settings });
      submission.replies.push({
        body,
        sentTo: submission.email,
        sentBy: admin.email,
        sentAt: new Date(),
        deliveryStatus: emailResult.status
      });
      submission.isRead = true;
      submission.status = "replied";
      await submission.save();

      return NextResponse.json({ success: true, notification: serializeSubmission(submission.toObject()) });
    }

    const updated = await ContactSubmission.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      notification: serializeSubmission(updated)
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
