import { NextResponse } from "next/server";

import { evaluateCompliance } from "@/lib/compliance/engine";
import type { ComplianceRequest, ProviderCredential } from "@/lib/compliance/types";
import {
  insertRow,
  isSupabaseConfigured,
  selectRows,
} from "@/lib/supabase/server-rest";

interface PaymentAuthorizationRequest
  extends Omit<ComplianceRequest, "credential"> {
  customerId?: string;
  providerServiceAmountCents?: number;
  tryammPlatformFeeCents?: number;
  bookingFeeCents?: number;
  processorFeeCents?: number;
  taxCents?: number;
  refundReserveCents?: number;
  currency?: string;
}

interface CredentialRow {
  provider_id: string;
  vertical: ProviderCredential["vertical"];
  jurisdiction: string;
  credential_type: string;
  license_number?: string | null;
  issuing_authority?: string | null;
  verification_status: ProviderCredential["status"];
  expires_at?: string | null;
  verified_at?: string | null;
}

function validMoney(value: number | undefined) {
  return value === undefined || (Number.isInteger(value) && value >= 0);
}

function toCredential(row: CredentialRow): ProviderCredential {
  return {
    providerId: row.provider_id,
    vertical: row.vertical,
    jurisdiction: row.jurisdiction,
    credentialType: row.credential_type,
    licenseNumber: row.license_number ?? undefined,
    issuingAuthority: row.issuing_authority ?? undefined,
    status: row.verification_status,
    expiresAt: row.expires_at ?? undefined,
    verifiedAt: row.verified_at ?? undefined,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentAuthorizationRequest;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          paymentAuthorized: false,
          persisted: false,
          error: "AUDIT_PERSISTENCE_REQUIRED",
          message: "The regulated transaction cannot be authorized until server-side Supabase persistence is configured.",
        },
        { status: 503 },
      );
    }

    const encodedProvider = encodeURIComponent(body.providerId ?? "");
    const encodedVertical = encodeURIComponent(body.vertical ?? "");
    const encodedJurisdiction = encodeURIComponent(body.jurisdiction ?? "");

    const credentialRows = await selectRows<CredentialRow>(
      "provider_credentials",
      `provider_id=eq.${encodedProvider}&vertical=eq.${encodedVertical}&jurisdiction=eq.${encodedJurisdiction}&select=*&order=verified_at.desc.nullslast,created_at.desc&limit=1`,
    );

    const complianceRequest: ComplianceRequest = {
      vertical: body.vertical,
      jurisdiction: body.jurisdiction,
      providerId: body.providerId,
      credential: credentialRows[0] ? toCredential(credentialRows[0]) : null,
      requestedFeeType: body.requestedFeeType,
      requestedAmountCents: body.requestedAmountCents,
    };

    const decision = evaluateCompliance(complianceRequest);

    if (!decision.allowed || decision.status !== "approved") {
      await insertRow("compliance_checks", {
        provider_id: body.providerId || null,
        vertical: body.vertical,
        jurisdiction: body.jurisdiction,
        fee_type: body.requestedFeeType,
        amount_cents: Math.max(0, Number(body.requestedAmountCents) || 0),
        decision: decision.status,
        decision_code: decision.code,
        reasons: decision.reasons,
        required_actions: decision.requiredActions,
        request_snapshot: {
          ...body,
          credentialSource: "provider_credentials",
        },
      });

      return NextResponse.json(
        {
          ok: false,
          paymentAuthorized: false,
          error: "COMPLIANCE_GATE_DENIED",
          decision,
        },
        { status: decision.status === "manual_review" ? 409 : 422 },
      );
    }

    const moneyFields = [
      body.providerServiceAmountCents,
      body.tryammPlatformFeeCents,
      body.bookingFeeCents,
      body.processorFeeCents,
      body.taxCents,
      body.refundReserveCents,
    ];

    if (!moneyFields.every(validMoney)) {
      return NextResponse.json(
        {
          ok: false,
          paymentAuthorized: false,
          error: "INVALID_TRANSACTION_COMPONENT",
          message: "All transaction components must be non-negative integer cents.",
        },
        { status: 400 },
      );
    }

    const providerService = body.providerServiceAmountCents ?? 0;
    const reserve = body.refundReserveCents ?? 0;
    const providerPayable = Math.max(0, providerService - reserve);

    const complianceCheck = await insertRow<Record<string, unknown>>("compliance_checks", {
      provider_id: body.providerId,
      vertical: body.vertical,
      jurisdiction: body.jurisdiction,
      fee_type: body.requestedFeeType,
      amount_cents: body.requestedAmountCents,
      decision: decision.status,
      decision_code: decision.code,
      reasons: decision.reasons,
      required_actions: decision.requiredActions,
      request_snapshot: {
        ...body,
        credentialSource: "provider_credentials",
      },
    });

    const transaction = await insertRow<Record<string, unknown>>("regulated_transactions", {
      customer_id: body.customerId ?? null,
      provider_id: body.providerId,
      compliance_check_id: complianceCheck.id,
      vertical: body.vertical,
      jurisdiction: body.jurisdiction,
      currency: (body.currency ?? "usd").toLowerCase(),
      provider_service_amount_cents: providerService,
      tryamm_platform_fee_cents: body.tryammPlatformFeeCents ?? 0,
      booking_fee_cents: body.bookingFeeCents ?? 0,
      processor_fee_cents: body.processorFeeCents ?? 0,
      tax_cents: body.taxCents ?? 0,
      refund_reserve_cents: reserve,
      provider_payable_cents: providerPayable,
      status: "authorized",
    });

    await insertRow("audit_events", {
      actor_id: body.customerId ?? null,
      actor_type: "customer",
      event_type: "regulated_transaction.authorized",
      resource_type: "regulated_transaction",
      resource_id: transaction.id,
      payload: {
        complianceCheckId: complianceCheck.id,
        decisionCode: decision.code,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        paymentAuthorized: true,
        persisted: true,
        decision,
        transaction,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        paymentAuthorized: false,
        error: "PAYMENT_AUTHORIZATION_FAILED",
        message: error instanceof Error ? error.message : "Unable to authorize payment.",
      },
      { status: 500 },
    );
  }
}
