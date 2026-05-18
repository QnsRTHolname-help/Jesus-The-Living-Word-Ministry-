import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Retreat from "@/lib/models/Retreat";
import { getAdminFromRequest } from "@/lib/auth";
import { serializeRetreat } from "@/lib/data";
import { createLocalRetreat, getLocalRetreats } from "@/lib/localStore";

export async function GET() {
  try {
    await connectDb();
    const retreats = await Retreat.find({}).sort({ date: 1 }).lean();
    return NextResponse.json({ retreats: retreats.map(serializeRetreat) });
  } catch {
    const retreats = await getLocalRetreats();
    return NextResponse.json({ retreats, storage: "local" });
  }
}

export async function POST(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let body;

  try {
    body = await request.json();
    const required = ["title", "description", "date", "location"];
    const missing = required.find((field) => !String(body[field] || "").trim());

    if (missing) {
      return NextResponse.json({ message: `${missing} is required.` }, { status: 400 });
    }

    await connectDb();
    const retreat = await Retreat.create({
      title: body.title.trim(),
      description: body.description.trim(),
      date: body.date,
      location: body.location.trim(),
      image: body.image || ""
    });

    return NextResponse.json({ retreat: serializeRetreat(retreat.toObject()) }, { status: 201 });
  } catch {
    if (!body) return NextResponse.json({ message: "Unable to create retreat." }, { status: 503 });

    const retreat = await createLocalRetreat({
      title: body.title.trim(),
      description: body.description.trim(),
      date: body.date,
      location: body.location.trim(),
      image: body.image || ""
    });
    return NextResponse.json({ retreat, storage: "local" }, { status: 201 });
  }
}
