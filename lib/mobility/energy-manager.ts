import type { MobilityAsset } from "./types";

export interface EnergyPlan {
  assetId: string;
  currentBatteryPercent: number;
  minimumReservePercent: number;
  estimatedMissionUsePercent: number;
  chargeRequired: boolean;
  recommendedTargetPercent: number;
  reasons: string[];
}

export function planEnergy(
  asset: MobilityAsset,
  estimatedMissionUsePercent: number,
  minimumReservePercent = 20,
): EnergyPlan {
  const current = Math.max(0, Math.min(100, asset.batteryPercent ?? 0));
  const projected = current - Math.max(0, estimatedMissionUsePercent);
  const chargeRequired = projected < minimumReservePercent;
  const recommendedTargetPercent = Math.min(
    100,
    Math.ceil(Math.max(current, estimatedMissionUsePercent + minimumReservePercent)),
  );

  const reasons = chargeRequired
    ? ["projected post-mission battery would fall below the required reserve"]
    : ["projected post-mission battery remains above the required reserve"];

  return {
    assetId: asset.id,
    currentBatteryPercent: current,
    minimumReservePercent,
    estimatedMissionUsePercent,
    chargeRequired,
    recommendedTargetPercent,
    reasons,
  };
}
