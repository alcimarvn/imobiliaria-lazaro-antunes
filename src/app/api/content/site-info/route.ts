import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM site_settings").all();
    const settings: Record<string, string> = {};
    (rows as any[]).forEach((r: any) => { settings[r.key] = r.value; });
    return NextResponse.json({ ok: true, data: settings });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const stmt = db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)");
    Object.entries(body).forEach(([k, v]) => { stmt.run(k, String(v)); });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
