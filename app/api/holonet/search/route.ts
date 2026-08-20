import { NextRequest, NextResponse } from "next/server";
import { publicHoloCrawlLinks } from "@/lib/seo/holo-links";
import { listHoloNetServices } from "@/lib/holonet/gateway";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();
  if (!q) return NextResponse.json({ query: "", results: [] });

  const pages = publicHoloCrawlLinks
    .filter((item) => `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(q))
    .map((item) => ({ type: "page", title: item.title, description: item.description, href: item.href }));

  const services = listHoloNetServices()
    .filter((item) => item.public)
    .filter((item) => `${item.name} ${item.kind} ${item.capabilities.join(" ")}`.toLowerCase().includes(q))
    .map((item) => ({ type: "service", title: item.name, description: item.capabilities.join(" • "), href: item.endpoint }));

  const deduped = [...pages, ...services].filter((item, index, all) =>
    all.findIndex((candidate) => candidate.title === item.title && candidate.href === item.href) === index
  );

  return NextResponse.json({ query: q, results: deduped.slice(0, 50) });
}
