import { NextResponse } from "next/server";

import { evaluateCompliance } from "@/lib/compliance/engine";
import type { ComplianceRequest } from "@/lib/compliance/types";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase/server-rest";

interface PaymentAuthorizationRequest extends ComplianceRequest {
  customerId?: string;
  providerServiceAmountCents?: number;
  tryammPlatformFeeCents?: number;
  bookingFeeCents?: number;
  processorFeeCents?: number;
  taxCents?: number;
  refundReserveCents?: number;
  currency?: string;
}

function validMoney(value: number | undefined) {
  return value === undefined || (Number.isInteger(value) && value >= 0);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentAuthorizationRequest;
    const decision = evaluateCompliance(body);

    if (!decision.allowed || decision.status !== "approved") {
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

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          ok: true,
          paymentAuthorized: true,
          persisted: false,
          decision,
          warning: "Compliance passed, but Supabase is not configured. No production payment should be created until the audit record is persisted.",
        },
        { status: 200 },
      );
    }

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
      request_snapshot: body,
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
