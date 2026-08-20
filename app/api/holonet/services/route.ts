import { NextResponse } from "next/server";
import { listHoloNetServices } from "@/lib/holonet/gateway";

export async function GET() {
  return NextResponse.json({ services: listHoloNetServices().map((service) => ({
    id: service.id,
    name: service.name,
    kind: service.kind,
    endpoint: service.public ? service.endpoint : undefined,
    public: service.public,
    version: service.version,
    capabilities: service.capabilities,
  })) });
}
