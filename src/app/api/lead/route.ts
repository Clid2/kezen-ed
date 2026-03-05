import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const contact = String(body?.contact ?? "").trim();
    const goal = String(body?.goal ?? "").trim();

    if (!name || !contact || !goal) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    console.log("NEW_LEAD", { name, contact, goal, ts: new Date().toISOString() });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}