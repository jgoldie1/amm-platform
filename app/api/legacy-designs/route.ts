import { NextResponse } from "next/server";

import { getLegacyDesign, recoveredLegacyDesigns } from "@/lib/legacy-design-vault/registry";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const domain = url.searchParams.get("domain")?.trim();

  if (query) {
    const design = getLegacyDesign(query);
    return NextResponse.json({ ok: true, design: design ?? null }, { status: design ? 200 : 404 });
  }

  const designs = domain
    ? recoveredLegacyDesigns.filter((design) => design.domain === domain)
    : recoveredLegacyDesigns;

  return NextResponse.json({
    ok: true,
    count: designs.length,
    designs,
    note: "Recovered records preserve known facts and explicitly retain unresolved specifications rather than inventing missing history.",
  });
}
