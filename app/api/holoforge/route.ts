import { NextResponse } from "next/server";

import { planForgeRequest } from "@/lib/holoforge/engine";
import type { ForgeRequest } from "@/lib/holoforge/types";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase/server-rest";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ForgeRequest>;

    if (!body.ownerId || !body.assetType || !body.prompt || !body.destinations) {
      return NextResponse.json(
        { ok: false, error: "FORGE_REQUEST_INVALID" },
        { status: 400 },
      );
    }

    const forgeRequest: ForgeRequest = {
      id: body.id ?? crypto.randomUUID(),
      ownerId: body.ownerId,
      assetType: body.assetType,
      destinations: body.destinations,
      prompt: body.prompt,
      sourceAssetIds: body.sourceAssetIds ?? [],
      locale: body.locale,
      accessibility: body.accessibility,
      commercialUseIntended: body.commercialUseIntended ?? false,
      manufacturingUseIntended: body.manufacturingUseIntended ?? false,
    };

    const result = planForgeRequest(forgeRequest);

    if (isSupabaseConfigured()) {
      await insertRow("forge_requests", {
        id: forgeRequest.id,
        owner_id: forgeRequest.ownerId,
        asset_type: forgeRequest.assetType,
        destinations: forgeRequest.destinations,
        prompt: forgeRequest.prompt,
        source_asset_ids: forgeRequest.sourceAssetIds ?? [],
        locale: forgeRequest.locale ?? null,
        accessibility: forgeRequest.accessibility ?? {},
        commercial_use_intended: forgeRequest.commercialUseIntended ?? false,
        manufacturing_use_intended: forgeRequest.manufacturingUseIntended ?? false,
        status: result.status,
        reasons: result.reasons,
      });
    }

    return NextResponse.json({ ok: true, forgeRequest, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "FORGE_FAILED",
        message: error instanceof Error ? error.message : "Unable to plan forge request",
      },
      { status: 500 },
    );
  }
}
