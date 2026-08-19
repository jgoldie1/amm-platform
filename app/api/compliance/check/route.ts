import { NextResponse } from "next/server";

import { evaluateCompliance } from "@/lib/compliance/engine";
import type { ComplianceRequest } from "@/lib/compliance/types";
import { orchestrateStubbsAI } from "@/lib/stubbs-ai/orchestrator";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ComplianceRequest;
    const intelligence = await orchestrateStubbsAI({
      requestId: crypto.randomUUID(),
      domain: "compliance",
      action: "evaluate_regulated_service",
      riskClass: "regulated",
      memoryQuery: `${body.vertical} ${body.jurisdiction} ${body.requestedFeeType}`,
      payload: {
        providerId: body.providerId,
        vertical: body.vertical,
        jurisdiction: body.jurisdiction,
        feeType: body.requestedFeeType,
      },
    });

    const decision = evaluateCompliance(body);

    return NextResponse.json(
      {
        ok: decision.status !== "blocked",
        intelligence,
        decision,
        evaluatedAt: new Date().toISOString(),
      },
      { status: decision.status === "blocked" ? 422 : 200 },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "INVALID_COMPLIANCE_REQUEST",
        message: "The request body must be valid JSON matching the ComplianceOS request schema.",
      },
      { status: 400 },
    );
  }
}
