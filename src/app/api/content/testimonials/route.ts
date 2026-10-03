import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ ok: true, data: db.prepare("SELECT * FROM testimonials ORDER BY order_num ASC").all() });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const id = crypto.randomUUID();
    db.prepare("INSERT INTO testimonials (id, client_name, client_origin, photo, comment, rating, active, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(id, body.client_name, body.client_origin || "", body.photo || "", body.comment, body.rating || 5, body.active ?? 1, body.order_num ?? 0);
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
    const fields = ["client_name","client_origin","photo","comment","rating","active","order_num"];
    fields.forEach(f => { if (body[f] !== undefined) db.prepare(`UPDATE testimonials SET ${f}=? WHERE id=?`).run(body[f], body.id); });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    db.prepare("DELETE FROM testimonials WHERE id = ?").run(body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
