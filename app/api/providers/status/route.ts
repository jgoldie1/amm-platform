import { NextResponse } from "next/server";

import { isSupabaseConfigured, selectRows } from "@/lib/supabase/server-rest";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const providerId = url.searchParams.get("providerId")?.trim();

  if (!providerId) {
    return NextResponse.json(
      { ok: false, error: "PROVIDER_ID_REQUIRED" },
      { status: 400 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "SUPABASE_NOT_CONFIGURED",
        message: "Configure server-side Supabase credentials before loading provider status.",
      },
      { status: 503 },
    );
  }

  try {
    const encodedId = encodeURIComponent(providerId);
    const providers = await selectRows<Record<string, unknown>>(
      "providers",
      `id=eq.${encodedId}&select=*`,
    );
    const credentials = await selectRows<Record<string, unknown>>(
      "provider_credentials",
      `provider_id=eq.${encodedId}&select=*&order=created_at.desc`,
    );

    if (!providers[0]) {
      return NextResponse.json(
        { ok: false, error: "PROVIDER_NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      provider: providers[0],
      credentials,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "PROVIDER_STATUS_FAILED",
        message: error instanceof Error ? error.message : "Unable to load provider status.",
      },
      { status: 500 },
    );
  }
}
