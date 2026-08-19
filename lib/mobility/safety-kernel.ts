import type { MobilityAsset, MobilityDecision, MobilityMission, MobilitySafetyEnvelope } from "./types";

export function evaluateMobilitySafety(
  asset: MobilityAsset,
  mission: MobilityMission,
  envelope: MobilitySafetyEnvelope,
): MobilityDecision {
  const reasons: string[] = [];
  const requiredActions: string[] = [];

  if (asset.maintenanceState !== "ready") {
    reasons.push(`asset is not ready: ${asset.maintenanceState}`);
  }
  if (typeof asset.batteryPercent === "number" && envelope.minimumBatteryPercent && asset.batteryPercent < envelope.minimumBatteryPercent) {
    reasons.push("battery below mission safety reserve");
  }
  if (typeof asset.speedMps === "number" && envelope.maxSpeedMps && asset.speedMps > envelope.maxSpeedMps) {
    reasons.push("asset speed exceeds safety envelope");
  }
  if (typeof asset.payloadKg === "number" && envelope.maxPayloadKg && asset.payloadKg > envelope.maxPayloadKg) {
    reasons.push("payload exceeds safety envelope");
  }
  if (asset.position?.altitudeMeters && envelope.maxAltitudeMeters && asset.position.altitudeMeters > envelope.maxAltitudeMeters) {
    reasons.push("altitude exceeds safety envelope");
  }
  if (envelope.emergencyStopRequired) requiredActions.push("verify emergency-stop channel before motion");
  if (envelope.collisionAvoidanceRequired) requiredActions.push("verify collision-avoidance sensors and deterministic controller");
  if (envelope.requiresSimulationGate) requiredActions.push("pass digital-twin/simulation mission gate");
  if (envelope.requiresRemoteOperator) requiredActions.push("verify authorized remote operator and communications link");
  if (mission.requiresHumanApproval) requiredActions.push("obtain explicit human mission approval");

  return {
    allowed: reasons.length === 0,
    reasons,
    requiredActions,
  };
}
