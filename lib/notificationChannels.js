function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function escapeText(value) {
  return String(value || "").replace(/[<>]/g, "");
}

export function getVisitorIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function normalizeContactInput(input) {
  return {
    name: escapeText(input.name).trim().slice(0, 90),
    email: String(input.email || "").trim().toLowerCase().slice(0, 140),
    phone: escapeText(input.phone).trim().slice(0, 50),
    requestType: escapeText(input.requestType || "general").trim().slice(0, 40),
    subject: escapeText(input.subject).trim().slice(0, 140),
    message: String(input.message || "").trim().slice(0, 5000),
    sourcePage: escapeText(input.sourcePage || "/contact").trim().slice(0, 160)
  };
}

export async function sendResendEmail({ to, subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Aurora Ministry <onboarding@resend.dev>";

  if (!apiKey || !to) return { ok: false, status: "not_configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        reply_to: replyTo
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Resend email failed:", text);
      return { ok: false, status: "failed" };
    }

    return { ok: true, status: "sent" };
  } catch (error) {
    console.error("Resend email error:", error);
    return { ok: false, status: "failed" };
  }
}

export async function sendWhatsAppNotification({ to, body }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from || !to) return { ok: false, status: "not_configured" };

  try {
    const payload = new URLSearchParams({
      From: from,
      To: to,
      Body: body
    });

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Twilio WhatsApp failed:", text);
      return { ok: false, status: "failed" };
    }

    return { ok: true, status: "sent" };
  } catch (error) {
    console.error("Twilio WhatsApp error:", error);
    return { ok: false, status: "failed" };
  }
}

export async function notifyContactSubmission(submission, settings) {
  const adminEmail =
    settings?.adminNotificationEmail ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    settings?.contactEmail ||
    process.env.ADMIN_EMAIL;
  const notificationStatus = {
    adminEmail: "not_configured",
    autoReply: "not_configured",
    whatsapp: "not_configured"
  };

  const dashboardUrl = `${getBaseUrl()}/admin/notifications`;
  const subject = `New ${submission.requestType || "contact"} message from ${submission.name}`;
  const adminHtml = `
    <div style="font-family:Inter,Arial,sans-serif;background:#070707;color:#f7f5ef;padding:28px;border-radius:18px">
      <p style="color:#d8b86a;text-transform:uppercase;letter-spacing:.14em;font-size:12px;margin:0 0 12px">New ministry message</p>
      <h1 style="margin:0 0 16px;font-size:24px">${escapeText(submission.subject || "Contact message")}</h1>
      <p><strong>Name:</strong> ${escapeText(submission.name)}</p>
      <p><strong>Email:</strong> ${escapeText(submission.email)}</p>
      <p><strong>Phone:</strong> ${escapeText(submission.phone || "Not provided")}</p>
      <p><strong>Type:</strong> ${escapeText(submission.requestType)}</p>
      <div style="white-space:pre-wrap;line-height:1.7;margin-top:18px">${escapeText(submission.message)}</div>
      <p style="margin-top:24px"><a href="${dashboardUrl}" style="color:#16110a;background:#f5d984;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">Open admin inbox</a></p>
    </div>
  `;

  if (settings?.notificationEmailEnabled !== false) {
    const result = await sendResendEmail({
      to: adminEmail,
      subject,
      html: adminHtml,
      replyTo: submission.email
    });
    notificationStatus.adminEmail = result.status;
  }

  if (settings?.autoresponderEnabled !== false) {
    const autoSubject = settings?.autoresponderSubject || "We received your message";
    const autoBody =
      settings?.autoresponderBody ||
      "Thank you for reaching out. Our ministry team has received your message and will respond soon.";
    const result = await sendResendEmail({
      to: submission.email,
      subject: autoSubject,
      html: `<div style="font-family:Inter,Arial,sans-serif;line-height:1.7">${escapeText(autoBody).replace(/\n/g, "<br>")}</div>`,
      replyTo: adminEmail
    });
    notificationStatus.autoReply = result.status;
  }

  if (settings?.whatsappNotificationsEnabled) {
    const result = await sendWhatsAppNotification({
      to: settings?.adminWhatsappNumber || process.env.ADMIN_WHATSAPP_TO,
      body: `New ministry message from ${submission.name}: ${submission.subject || submission.requestType}. Open ${dashboardUrl}`
    });
    notificationStatus.whatsapp = result.status;
  }

  return notificationStatus;
}

export async function sendReplyEmail({ submission, body, adminEmail, settings }) {
  const subject = `Re: ${submission.subject || "Your message to " + (settings?.siteTitle || "Aurora Ministry")}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.7">
      ${escapeText(body).replace(/\n/g, "<br>")}
      <hr style="border:0;border-top:1px solid #ddd;margin:24px 0">
      <p style="color:#666;font-size:13px">Sent by ${escapeText(adminEmail)} through the ${escapeText(settings?.siteTitle || "ministry")} admin inbox.</p>
    </div>
  `;

  return sendResendEmail({
    to: submission.email,
    subject,
    html,
    replyTo: settings?.contactEmail || adminEmail
  });
}
