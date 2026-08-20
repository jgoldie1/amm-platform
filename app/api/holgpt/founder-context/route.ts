import { NextResponse } from "next/server";

import { assembleFounderContext } from "@/lib/holgpt/founder-context";
import { requireFounderOwner } from "@/lib/founder-archive/access";
import type { StubbsAIRequest } from "@/lib/stubbs-ai/types";

interface FounderContextRequest {
  ownerId?: string;
  query?: string;
  request?: StubbsAIRequest;
  limit?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FounderContextRequest;

    if (!body.ownerId || !body.query || !body.request) {
      return NextResponse.json(
        {
          ok: false,
          error: "FOUNDER_CONTEXT_INPUT_REQUIRED",
          message: "ownerId, query and Stubbs AI request are required.",
        },
        { status: 400 },
      );
    }

    await requireFounderOwner(request, body.ownerId);

    const bundle = await assembleFounderContext({
      ownerId: body.ownerId,
      query: body.query,
      request: body.request,
      limit: body.limit,
    });

    return NextResponse.json({
      ok: true,
      bundle,
      permissions: {
        retrieval: true,
        export: false,
        share: false,
        delete: false,
        changeOwnership: false,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "FOUNDER_CONTEXT_DENIED",
        message: error instanceof Error ? error.message : "Founder context access denied.",
      },
      { status: 403 },
    );
  }
}
