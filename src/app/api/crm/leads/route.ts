import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET(req: Request) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    let sql = "SELECT * FROM leads";
    const params: any[] = [];
    if (status) { sql += " WHERE status = ?"; params.push(status); }
    sql += " ORDER BY created_at DESC";
    const rows = db.prepare(sql).all(...params);
    return NextResponse.json({ ok: true, data: rows });
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
    db.prepare("INSERT INTO leads (id, name, phone, email, city, status, source, budget, property_interest, priority, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(id, body.name, body.phone || "", body.email || "", body.city || "", body.status || "novo", body.source || "Manual", body.budget || "", body.property_interest || "", body.priority || "media", body.notes || "", now, now);
    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    if (!body.id) return NextResponse.json({ ok: false, error: "ID obrigatório" }, { status: 400 });
    const now = new Date().toISOString();
    const fields = ["name","phone","email","city","status","source","budget","property_interest","priority","notes"];
    fields.forEach(f => {
      if (body[f] !== undefined) db.prepare(`UPDATE leads SET ${f}=?, updated_at=? WHERE id=?`).run(body[f], now, body.id);
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    db.prepare("DELETE FROM interactions WHERE lead_id = ?").run(body.id);
    db.prepare("DELETE FROM tasks WHERE lead_id = ?").run(body.id);
    db.prepare("DELETE FROM leads WHERE id = ?").run(body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
