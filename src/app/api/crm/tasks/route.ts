import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET(req: Request) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const leadId = url.searchParams.get("lead_id");
    const completed = url.searchParams.get("completed");
    let sql = "SELECT * FROM tasks WHERE 1=1";
    const params: any[] = [];
    if (leadId) { sql += " AND lead_id = ?"; params.push(leadId); }
    if (completed !== null) { sql += " AND completed = ?"; params.push(Number(completed)); }
    sql += " ORDER BY due_date ASC";
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
    db.prepare("INSERT INTO tasks (id, lead_id, title, due_date, completed, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(id, body.lead_id || null, body.title, body.due_date || null, 0, now);
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
    if (body.completed !== undefined) db.prepare("UPDATE tasks SET completed=? WHERE id=?").run(body.completed, body.id);
    if (body.title !== undefined) db.prepare("UPDATE tasks SET title=? WHERE id=?").run(body.title, body.id);
    if (body.due_date !== undefined) db.prepare("UPDATE tasks SET due_date=? WHERE id=?").run(body.due_date, body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    db.prepare("DELETE FROM tasks WHERE id = ?").run(body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
