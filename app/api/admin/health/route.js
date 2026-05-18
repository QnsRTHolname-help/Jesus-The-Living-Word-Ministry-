import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getDatabaseStatus } from "@/lib/db";

export async function GET(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const database = await getDatabaseStatus();
  return NextResponse.json({ database });
}
