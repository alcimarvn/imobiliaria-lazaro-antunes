import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ ok: true, data: db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all() });
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
    db.prepare("INSERT INTO contact_messages (id, name, email, phone, message, property_id, created_at, read) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(id, body.name, body.email || "", body.phone || "", body.message, body.property_id || null, now, 0);

    // Criar lead automaticamente
    const leadId = crypto.randomUUID();
    db.prepare("INSERT INTO leads (id, name, phone, email, city, status, source, property_interest, priority, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(leadId, body.name, body.phone || "", body.email || "", "", "novo", "Formulário de Contato", body.property_id ? "Imóvel Cód. " + body.property_id : "Geral", "media", body.message, now, now);

    return NextResponse.json({ ok: true, id, leadId });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    if (body.id) db.prepare("UPDATE contact_messages SET read=1 WHERE id=?").run(body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    db.prepare("DELETE FROM contact_messages WHERE id = ?").run(body.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
