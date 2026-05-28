import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getSiteSettings } from "@/lib/data";
import ContactSubmission from "@/lib/models/ContactSubmission";
import {
  getVisitorIp,
  normalizeContactInput,
  notifyContactSubmission,
  validateEmail
} from "@/lib/notificationChannels";

const rateLimitStore = globalThis.__contactRateLimitStore || new Map();
globalThis.__contactRateLimitStore = rateLimitStore;

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 6;
  const record = rateLimitStore.get(ip) || { count: 0, resetAt: now + windowMs };

  if (record.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) return false;
  record.count += 1;
  rateLimitStore.set(ip, record);
  return true;
}

export async function POST(req) {
  try {
    const data = await req.json();
    const ip = getVisitorIp(req);
    const userAgent = req.headers.get("user-agent") || "";
    const input = normalizeContactInput(data);

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many messages. Please wait a few minutes and try again." }, { status: 429 });
    }

    if (String(data.website || "").trim()) {
      return NextResponse.json({ ok: true, message: "Message received." }, { status: 201 });
    }

    const captchaTotal = Number(data.captchaA) + Number(data.captchaB);
    if (!Number.isFinite(captchaTotal) || Number(data.captchaAnswer) !== captchaTotal) {
      return NextResponse.json({ error: "Please complete the security question correctly." }, { status: 400 });
    }

    if (!input.name || !input.email || !input.message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    if (!validateEmail(input.email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (input.message.length < 12) {
      return NextResponse.json({ error: "Please write a little more detail before sending." }, { status: 400 });
    }

    await connectDb();

    const settings = await getSiteSettings();
    const submission = await ContactSubmission.create({
      ...input,
      priority: input.requestType === "prayer" || input.requestType === "care" ? "high" : "normal",
      meta: {
        ip,
        userAgent,
        spamScore: 0
      }
    });

    const notificationStatus = await notifyContactSubmission(submission, settings);
    submission.notificationStatus = notificationStatus;
    await submission.save();

    return NextResponse.json(
      {
        ok: true,
        message: settings?.contactSuccessMessage || "Your message has been received. Our team will respond soon.",
        submissionId: submission._id.toString()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json({ error: "We could not send your message right now. Please try again." }, { status: 500 });
  }
}
