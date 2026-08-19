import type { MobilityAsset } from "./types";

export interface AccessibleDispatchRequest {
  requiredProfileIds: string[];
  preferredLocale?: string;
  minimumBatteryPercent?: number;
}

export interface DispatchCandidate {
  asset: MobilityAsset;
  score: number;
  reasons: string[];
}

export function rankAccessibleAssets(
  assets: MobilityAsset[],
  request: AccessibleDispatchRequest,
): DispatchCandidate[] {
  return assets
    .filter((asset) => asset.maintenanceState === "ready")
    .filter((asset) => (asset.batteryPercent ?? 0) >= (request.minimumBatteryPercent ?? 20))
    .map((asset) => {
      const profiles = new Set(asset.accessibilityProfileIds ?? []);
      const matched = request.requiredProfileIds.filter((id) => profiles.has(id));
      const completeMatch = matched.length === request.requiredProfileIds.length;
      const score = completeMatch ? 100 + (asset.batteryPercent ?? 0) : matched.length * 10;
      return {
        asset,
        score,
        reasons: [
          completeMatch
            ? "asset matches all requested accessibility profiles"
            : `asset matches ${matched.length}/${request.requiredProfileIds.length} requested accessibility profiles`,
        ],
      };
    })
    .sort((a, b) => b.score - a.score);
}
