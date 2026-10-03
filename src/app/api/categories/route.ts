import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM categories ORDER BY name ASC").all();
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
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    db.prepare("INSERT INTO categories (id, name, slug, description, active) VALUES (?, ?, ?, ?, ?)").run(id, body.name, slug, body.description || "", body.active ?? 1);
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
    if (body.name !== undefined) db.prepare("UPDATE categories SET name=? WHERE id=?").run(body.name, body.id);
    if (body.slug !== undefined) db.prepare("UPDATE categories SET slug=? WHERE id=?").run(body.slug, body.id);
    if (body.description !== undefined) db.prepare("UPDATE categories SET description=? WHERE id=?").run(body.description, body.id);
    if (body.active !== undefined) db.prepare("UPDATE categories SET active=? WHERE id=?").run(body.active, body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    db.prepare("DELETE FROM categories WHERE id = ?").run(body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
