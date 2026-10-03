import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM cities ORDER BY order_num ASC, name ASC").all();
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
    db.prepare("INSERT INTO cities (id, name, state, active, order_num) VALUES (?, ?, ?, ?, ?)").run(id, body.name, body.state || "RS", body.active ?? 1, body.order_num ?? 0);
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
    if (body.name !== undefined) db.prepare("UPDATE cities SET name=? WHERE id=?").run(body.name, body.id);
    if (body.active !== undefined) db.prepare("UPDATE cities SET active=? WHERE id=?").run(body.active, body.id);
    if (body.order_num !== undefined) db.prepare("UPDATE cities SET order_num=? WHERE id=?").run(body.order_num, body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    db.prepare("DELETE FROM cities WHERE id = ?").run(body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
