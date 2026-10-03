import { NextRequest, NextResponse } from "next/server";
import { getAllProperties } from "@/lib/crm-db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const allProperties = getAllProperties();
    const results = allProperties.filter((property) => {
      const titleMatch = property.title?.toLowerCase().includes(query);
      const cityMatch = property.city?.toLowerCase().includes(query);
      const neighborhoodMatch = property.neighborhood?.toLowerCase().includes(query);
      const typeMatch = property.type?.toLowerCase().includes(query);
      const descMatch = property.description?.toLowerCase().includes(query);
      const featuresMatch = Array.isArray(property.features) && property.features.some((f) => f.toLowerCase().includes(query));
      const idMatch = String(property.id) === query || `#${property.id}` === query;

      return (
        titleMatch ||
        cityMatch ||
        neighborhoodMatch ||
        typeMatch ||
        descMatch ||
        featuresMatch ||
        idMatch
      );
    });

    return NextResponse.json({
      query,
      total: results.length,
      results: results.slice(0, 6),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, results: [] }, { status: 500 });
  }
}