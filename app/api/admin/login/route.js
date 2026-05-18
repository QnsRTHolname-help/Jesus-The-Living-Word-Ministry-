import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { getAuthCookieName, getAuthCookieOptions, signAdminToken } from "@/lib/auth";

export async function POST(request) {
  let normalizedEmail = "";
  let plainPassword = "";

  try {
    const { email, password } = await request.json();
    normalizedEmail = String(email || "").trim().toLowerCase();
    plainPassword = String(password || "");

    if (!normalizedEmail || !plainPassword) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    await connectDb();

    let admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin && normalizedEmail === process.env.ADMIN_EMAIL?.toLowerCase() && plainPassword === process.env.ADMIN_PASSWORD) {
      admin = await Admin.create({
        email: normalizedEmail,
        password: await bcrypt.hash(plainPassword, 12)
      });
    }

    if (!admin) {
      return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
    }

    const valid = await bcrypt.compare(plainPassword, admin.password);
    if (!valid) {
      return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
    }

    const token = signAdminToken(admin);
    const response = NextResponse.json({ ok: true, admin: { email: admin.email } });
    response.cookies.set(getAuthCookieName(), token, getAuthCookieOptions());
    return response;
  } catch (error) {
    const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD;

    if (normalizedEmail && plainPassword && normalizedEmail === envEmail && plainPassword === envPassword) {
      const token = signAdminToken({ _id: "env-admin", email: normalizedEmail });
      const response = NextResponse.json({
        ok: true,
        admin: { email: normalizedEmail },
        warning: "Signed in with environment credentials because the database is not reachable."
      });
      response.cookies.set(getAuthCookieName(), token, getAuthCookieOptions());
      return response;
    }

    return NextResponse.json(
      { message: "Unable to sign in. Check the database connection and environment variables." },
      { status: 503 }
    );
  }
}
