import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Retreat from "@/lib/models/Retreat";
import { getAdminFromRequest } from "@/lib/auth";
import { serializeRetreat } from "@/lib/data";
import { deleteLocalRetreat, updateLocalRetreat } from "@/lib/localStore";

export async function PUT(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let body;
  const { id } = await params;

  try {
    body = await request.json();
    const required = ["title", "description", "date", "location"];
    const missing = required.find((field) => !String(body[field] || "").trim());

    if (missing) {
      return NextResponse.json({ message: `${missing} is required.` }, { status: 400 });
    }

    await connectDb();
    const retreat = await Retreat.findByIdAndUpdate(
      id,
      {
        title: body.title.trim(),
        description: body.description.trim(),
        date: body.date,
        location: body.location.trim(),
        image: body.image || ""
      },
      { new: true, runValidators: true }
    ).lean();

    if (!retreat) return NextResponse.json({ message: "Retreat not found." }, { status: 404 });
    return NextResponse.json({ retreat: serializeRetreat(retreat) });
  } catch {
    if (!body) return NextResponse.json({ message: "Unable to update retreat." }, { status: 503 });

    const retreat = await updateLocalRetreat(id, {
      title: body.title.trim(),
      description: body.description.trim(),
      date: body.date,
      location: body.location.trim(),
      image: body.image || ""
    });

    if (!retreat) return NextResponse.json({ message: "Retreat not found." }, { status: 404 });
    return NextResponse.json({ retreat, storage: "local" });
  }
}

export async function DELETE(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await connectDb();
    await Retreat.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch {
    await deleteLocalRetreat(id);
    return NextResponse.json({ ok: true, storage: "local" });
  }
}
