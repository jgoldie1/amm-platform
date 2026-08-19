import { NextResponse } from "next/server";

import { orchestrateStubbsAI } from "@/lib/stubbs-ai/orchestrator";
import { evaluateMobilitySafety } from "@/lib/mobility/safety-kernel";
import { planEnergy } from "@/lib/mobility/energy-manager";
import type { MobilityAsset, MobilityMission, MobilitySafetyEnvelope } from "@/lib/mobility/types";

interface MissionPlanRequest {
  asset: MobilityAsset;
  mission: MobilityMission;
  envelope: MobilitySafetyEnvelope;
  estimatedMissionUsePercent?: number;
  actorId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MissionPlanRequest;

    const ai = await orchestrateStubbsAI({
      requestId: crypto.randomUUID(),
      domain: "mobility",
      action: "plan_mission",
      actorId: body.actorId,
      riskClass: "high",
      memoryQuery: `mobility mission ${body.mission.missionType} ${body.mission.origin} ${body.mission.destination ?? ""}`,
      payload: {
        assetId: body.asset.id,
        class: body.asset.class,
        missionId: body.mission.id,
        locale: body.mission.locale,
        accessibleAssistanceRequested: body.mission.accessibleAssistanceRequested,
      },
    });

    const safety = evaluateMobilitySafety(body.asset, body.mission, body.envelope);
    const energy = planEnergy(body.asset, body.estimatedMissionUsePercent ?? 0, body.envelope.minimumBatteryPercent ?? 20);
    const allowed = ai.guardian.mode !== "block" && safety.allowed && !energy.chargeRequired;

    return NextResponse.json({
      ok: true,
      allowed,
      ai,
      safety,
      energy,
      controlBoundary: {
        plannerOnly: true,
        actuatorCommandsReturned: false,
        note: "This endpoint plans and gates missions only. Steering, throttle, braking, rotor, flight-control, and actuator commands remain the responsibility of deterministic certified controllers.",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "MOBILITY_MISSION_PLAN_FAILED",
        message: error instanceof Error ? error.message : "Unable to plan mobility mission.",
      },
      { status: 400 },
    );
  }
}
