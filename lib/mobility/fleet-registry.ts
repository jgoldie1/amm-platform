import type { MobilityAsset, MobilityClass } from "./types";

export interface FleetFilter {
  class?: MobilityClass;
  jurisdiction?: string;
  maintenanceState?: MobilityAsset["maintenanceState"];
  minimumBatteryPercent?: number;
  accessibleProfileId?: string;
}

export function selectFleetAssets(
  assets: MobilityAsset[],
  filter: FleetFilter,
): MobilityAsset[] {
  return assets.filter((asset) => {
    if (filter.class && asset.class !== filter.class) return false;
    if (filter.jurisdiction && asset.jurisdiction !== filter.jurisdiction) return false;
    if (filter.maintenanceState && asset.maintenanceState !== filter.maintenanceState) return false;
    if (typeof filter.minimumBatteryPercent === "number" && (asset.batteryPercent ?? 0) < filter.minimumBatteryPercent) return false;
    if (filter.accessibleProfileId && !asset.accessibilityProfileIds?.includes(filter.accessibleProfileId)) return false;
    return true;
  });
}

export function fleetReadinessScore(asset: MobilityAsset): number {
  if (asset.maintenanceState !== "ready") return 0;
  const battery = asset.batteryPercent ?? 100;
  const batteryScore = Math.max(0, Math.min(100, battery));
  return Math.round(batteryScore);
}
