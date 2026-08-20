import { NextResponse } from "next/server";

import { orchestrateStubbsAI } from "@/lib/stubbs-ai/orchestrator";
import type { StubbsAIRequest } from "@/lib/stubbs-ai/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StubbsAIRequest;

    if (!body.requestId || !body.domain || !body.action) {
      return NextResponse.json(
        { ok: false, error: "INVALID_STUBBS_AI_REQUEST" },
        { status: 400 },
      );
    }

    const result = await orchestrateStubbsAI(body);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "STUBBS_AI_ORCHESTRATION_FAILED",
        message: error instanceof Error ? error.message : "Unable to orchestrate request.",
      },
      { status: 500 },
    );
  }
}
