import { NextResponse } from "next/server";

import { insertRow, isSupabaseConfigured } from "@/lib/supabase/server-rest";

interface OnboardProviderRequest {
  userId?: string;
  displayName: string;
  providerType: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OnboardProviderRequest;
    const displayName = body.displayName?.trim();
    const providerType = body.providerType?.trim();

    if (!displayName || !providerType) {
      return NextResponse.json(
        {
          ok: false,
          error: "PROVIDER_FIELDS_REQUIRED",
          message: "displayName and providerType are required.",
        },
        { status: 400 },
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error: "SUPABASE_NOT_CONFIGURED",
          message: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server before provider onboarding.",
        },
        { status: 503 },
      );
    }

    const provider = await insertRow<Record<string, unknown>>("providers", {
      user_id: body.userId ?? null,
      display_name: displayName,
      provider_type: providerType,
      verification_status: "pending",
      can_accept_transactions: false,
    });

    await insertRow("audit_events", {
      actor_id: body.userId ?? null,
      actor_type: "provider",
      event_type: "provider.onboarded",
      resource_type: "provider",
      resource_id: provider.id,
      payload: {
        displayName,
        providerType,
      },
    });

    return NextResponse.json({ ok: true, provider }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "PROVIDER_ONBOARDING_FAILED",
        message: error instanceof Error ? error.message : "Unable to onboard provider.",
      },
      { status: 500 },
    );
  }
}
