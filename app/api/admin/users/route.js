import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import Admin from "@/lib/models/Admin";

function serializeAdmin(admin) {
  return {
    _id: admin._id.toString(),
    name: admin.name || "Admin",
    email: admin.email,
    role: admin.role || "admin",
    isActive: admin.isActive !== false,
    lastLoginAt: admin.lastLoginAt instanceof Date ? admin.lastLoginAt.toISOString() : admin.lastLoginAt,
    createdAt: admin.createdAt instanceof Date ? admin.createdAt.toISOString() : admin.createdAt,
    updatedAt: admin.updatedAt instanceof Date ? admin.updatedAt.toISOString() : admin.updatedAt
  };
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export async function GET(request) {
  const signedIn = getAdminFromRequest(request);
  if (!signedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDb();
    const admins = await Admin.find({}).sort({ role: -1, createdAt: 1 }).lean();
    return NextResponse.json({ admins: admins.map(serializeAdmin), currentAdminEmail: signedIn.email });
  } catch (error) {
    console.error("Unable to load admins:", error);
    return NextResponse.json({ message: "Unable to load admin users." }, { status: 500 });
  }
}

export async function POST(request) {
  const signedIn = getAdminFromRequest(request);
  if (!signedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const name = String(body.name || "Admin").trim().slice(0, 80);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = body.role === "owner" ? "owner" : "admin";

    if (!isEmail(email)) return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });

    await connectDb();
    const existing = await Admin.findOne({ email });
    if (existing) return NextResponse.json({ message: "An admin with this email already exists." }, { status: 409 });

    const admin = await Admin.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role,
      isActive: true
    });

    return NextResponse.json({ admin: serializeAdmin(admin) }, { status: 201 });
  } catch (error) {
    console.error("Unable to create admin:", error);
    return NextResponse.json({ message: "Unable to create admin user." }, { status: 500 });
  }
}

export async function PATCH(request) {
  const signedIn = getAdminFromRequest(request);
  if (!signedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const id = String(body.id || "");
    const update = {};

    if (typeof body.name === "string") update.name = body.name.trim().slice(0, 80) || "Admin";
    if (body.role === "owner" || body.role === "admin") update.role = body.role;
    if (typeof body.isActive === "boolean") update.isActive = body.isActive;
    if (typeof body.password === "string" && body.password.trim()) {
      if (body.password.length < 8) return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
      update.password = await bcrypt.hash(body.password, 12);
    }

    await connectDb();
    const target = await Admin.findById(id);
    if (!target) return NextResponse.json({ message: "Admin user not found." }, { status: 404 });
    if (target.email === signedIn.email && update.isActive === false) {
      return NextResponse.json({ message: "You cannot deactivate your own account." }, { status: 400 });
    }

    Object.assign(target, update);
    await target.save();

    return NextResponse.json({ admin: serializeAdmin(target) });
  } catch (error) {
    console.error("Unable to update admin:", error);
    return NextResponse.json({ message: "Unable to update admin user." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const signedIn = getAdminFromRequest(request);
  if (!signedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    await connectDb();
    const target = await Admin.findById(id);
    if (!target) return NextResponse.json({ message: "Admin user not found." }, { status: 404 });
    if (target.email === signedIn.email) {
      return NextResponse.json({ message: "You cannot delete your own account." }, { status: 400 });
    }

    await target.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to delete admin:", error);
    return NextResponse.json({ message: "Unable to delete admin user." }, { status: 500 });
  }
}
