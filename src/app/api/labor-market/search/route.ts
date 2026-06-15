import { NextResponse } from "next/server";

import { searchOccupations } from "@/lib/labor-market/data";

// GET /api/labor-market/search?q=analista — CBO occupation autocomplete.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  try {
    const results = await searchOccupations(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("[labor-market/search]", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
