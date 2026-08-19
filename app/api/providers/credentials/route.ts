import { NextResponse } from "next/server";

import type { CredentialStatus, RegulatedVertical } from "@/lib/compliance/types";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase/server-rest";

interface CredentialRequest {
  providerId: string;
  vertical: RegulatedVertical;
  jurisdiction: string;
  credentialType: string;
  licenseNumber?: string;
  issuingAuthority?: string;
  expiresAt?: string;
  verificationSource?: string;
  status?: CredentialStatus;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CredentialRequest;
    const required = [
      body.providerId?.trim(),
      body.vertical?.trim(),
      body.jurisdiction?.trim(),
      body.credentialType?.trim(),
    ];

    if (required.some((value) => !value)) {
      return NextResponse.json(
        {
          ok: false,
          error: "CREDENTIAL_FIELDS_REQUIRED",
          message: "providerId, vertical, jurisdiction, and credentialType are required.",
        },
        { status: 400 },
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error: "SUPABASE_NOT_CONFIGURED",
          message: "Configure server-side Supabase credentials before storing provider credentials.",
        },
        { status: 503 },
      );
    }

    const status: CredentialStatus = body.status ?? "pending";
    const credential = await insertRow<Record<string, unknown>>("provider_credentials", {
      provider_id: body.providerId,
      vertical: body.vertical,
      jurisdiction: body.jurisdiction.trim(),
      credential_type: body.credentialType.trim(),
      license_number: body.licenseNumber?.trim() || null,
      issuing_authority: body.issuingAuthority?.trim() || null,
      verification_status: status,
      verified_at: status === "verified" ? new Date().toISOString() : null,
      expires_at: body.expiresAt || null,
      verification_source: body.verificationSource?.trim() || null,
    });

    await insertRow("audit_events", {
      actor_type: "provider",
      event_type: "provider.credential_submitted",
      resource_type: "provider_credential",
      resource_id: credential.id,
      payload: {
        providerId: body.providerId,
        vertical: body.vertical,
        jurisdiction: body.jurisdiction,
        status,
      },
    });

    return NextResponse.json({ ok: true, credential }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "CREDENTIAL_SUBMISSION_FAILED",
        message: error instanceof Error ? error.message : "Unable to store credential.",
      },
      { status: 500 },
    );
  }
}
