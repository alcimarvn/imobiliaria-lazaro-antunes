import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const row: any = db.prepare("SELECT * FROM properties WHERE id = ?").get(params.id);
    if (!row) return NextResponse.json({ ok: false, error: "Imóvel não encontrado" }, { status: 404 });
    const property = {
      ...row,
      featured: Boolean(row.featured),
      images: JSON.parse(row.images || "[]"),
      image_captions: JSON.parse(row.image_captions || "[]"),
      features: JSON.parse(row.features || "[]"),
      parkingSpots: row.parking_spots
    };
    return NextResponse.json({ ok: true, data: property });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const body = await req.json();
    const now = new Date().toISOString();
    const slug = body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Normaliza imagens e legendas
    let rawImages = body.images || [];
    let images: string[] = [];
    let captions: string[] = [];

    if (Array.isArray(rawImages)) {
      rawImages.forEach((img: any) => {
        if (typeof img === "string") {
          images.push(img);
          captions.push("");
        } else if (img && typeof img === "object") {
          images.push(img.url || "");
          captions.push(img.caption || img.description || "");
        }
      });
    }

    if (body.image_captions && Array.isArray(body.image_captions)) {
      captions = body.image_captions;
    }

    const stmt = db.prepare(`
      UPDATE properties SET 
        slug = ?, title = ?, description = ?, type = ?, status = ?, 
        city = ?, neighborhood = ?, price = ?, area = ?, bedrooms = ?, 
        suites = ?, bathrooms = ?, parking_spots = ?, featured = ?, 
        images = ?, image_captions = ?, features = ?, highlight_tag = ?, payment_conditions = ?, purpose = ?, updated_at = ? 
      WHERE id = ?
    `);

    stmt.run(
      slug,
      body.title,
      body.description || "",
      body.type || "Apartamento",
      body.status || "Venda",
      body.city || "Gramado",
      body.neighborhood || "Centro",
      Number(body.price) || 0,
      Number(body.area) || 0,
      Number(body.bedrooms) || 0,
      Number(body.suites) || 0,
      Number(body.bathrooms) || 0,
      Number(body.parkingSpots || body.parking_spots) || 0,
      body.featured ? 1 : 0,
      JSON.stringify(images),
      JSON.stringify(captions),
      JSON.stringify(body.features || []),
      body.highlight_tag !== undefined ? body.highlight_tag : "",
      body.payment_conditions !== undefined ? body.payment_conditions : "",
      body.purpose || "todos",
      now,
      params.id
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    db.prepare("DELETE FROM properties WHERE id = ?").run(params.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
