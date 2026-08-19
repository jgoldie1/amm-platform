export type MobilityClass =
  | "electric_car"
  | "delivery_drone"
  | "passenger_evtol"
  | "cargo_evtol"
  | "ground_robot"
  | "warehouse_robot"
  | "agricultural_robot"
  | "marine_vehicle"
  | "space_rover";

export type AutonomyMode =
  | "manual"
  | "assisted"
  | "supervised_autonomy"
  | "restricted_autonomy";

export interface MobilityAsset {
  id: string;
  class: MobilityClass;
  autonomyMode: AutonomyMode;
  operatorId?: string;
  jurisdiction: string;
  batteryPercent?: number;
  position?: { latitude: number; longitude: number; altitudeMeters?: number };
  speedMps?: number;
  payloadKg?: number;
  accessibilityProfileIds?: string[];
  maintenanceState: "ready" | "inspection_due" | "maintenance" | "grounded";
}

export interface MobilityMission {
  id: string;
  assetId: string;
  missionType: "transport" | "delivery" | "inspection" | "assist" | "patrol" | "mapping";
  origin: string;
  destination?: string;
  requiresHumanApproval: boolean;
  accessibleAssistanceRequested?: boolean;
  locale?: string;
}

export interface MobilitySafetyEnvelope {
  maxSpeedMps?: number;
  maxAltitudeMeters?: number;
  maxPayloadKg?: number;
  geofenceIds: string[];
  requiresRemoteOperator: boolean;
  requiresSimulationGate: boolean;
  emergencyStopRequired: boolean;
  collisionAvoidanceRequired: boolean;
  minimumBatteryPercent?: number;
}

export interface MobilityDecision {
  allowed: boolean;
  reasons: string[];
  requiredActions: string[];
}
