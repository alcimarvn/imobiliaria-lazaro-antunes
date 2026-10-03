import { NextResponse } from "next/server";
import { getDb } from "@/lib/crm-db";

export async function GET(req: Request) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const city = url.searchParams.get("city");
    const neighborhood = url.searchParams.get("neighborhood");
    const type = url.searchParams.get("type");
    const featured = url.searchParams.get("featured");
    const search = url.searchParams.get("search");
    const status = url.searchParams.get("status");

    let sql = "SELECT * FROM properties WHERE 1=1";
    const params: any[] = [];

    if (city) { sql += " AND LOWER(city) = LOWER(?)"; params.push(city); }
    if (neighborhood) { sql += " AND LOWER(neighborhood) LIKE LOWER(?)"; params.push("%" + neighborhood + "%"); }
    if (type) { sql += " AND LOWER(type) = LOWER(?)"; params.push(type); }
    if (featured) { sql += " AND featured = ?"; params.push(Number(featured)); }
    if (status) { sql += " AND LOWER(status) = LOWER(?)"; params.push(status); }
    if (search) {
      sql += " AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(neighborhood) LIKE ? OR LOWER(features) LIKE ?)";
      const q = "%" + search.toLowerCase() + "%";
      params.push(q, q, q, q);
    }
    sql += " ORDER BY created_at DESC";

    const stmt = db.prepare(sql);
    const rows: any[] = stmt.all(...params);
    const properties = rows.map((r: any) => ({
      ...r,
      featured: Boolean(r.featured),
      images: JSON.parse(r.images || "[]"),
      image_captions: JSON.parse(r.image_captions || "[]"),
      features: JSON.parse(r.features || "[]"),
      parkingSpots: r.parking_spots,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json({ ok: true, data: properties });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const id = body.id || crypto.randomUUID();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const now = new Date().toISOString();

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
      INSERT INTO properties (
        id, slug, title, description, type, status, 
        city, neighborhood, price, area, bedrooms, suites, 
        bathrooms, parking_spots, featured, images, image_captions, features, 
        highlight_tag, payment_conditions, purpose, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
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
      body.highlight_tag || "",
      body.payment_conditions || "",
      body.purpose || "todos",
      body.created_at || now,
      now
    );

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
