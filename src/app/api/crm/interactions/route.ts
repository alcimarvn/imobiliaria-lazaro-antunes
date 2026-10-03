import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET(req: Request) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const leadId = url.searchParams.get("lead_id");
    let sql = "SELECT * FROM interactions";
    const params: any[] = [];
    if (leadId) { sql += " WHERE lead_id = ?"; params.push(leadId); }
    sql += " ORDER BY created_at DESC";
    return NextResponse.json({ ok: true, data: db.prepare(sql).all(...params) });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.prepare("INSERT INTO interactions (id, lead_id, type, notes, created_at) VALUES (?, ?, ?, ?, ?)").run(id, body.lead_id, body.type || "whatsapp", body.notes || "", now);
    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    db.prepare("DELETE FROM interactions WHERE id = ?").run(body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
