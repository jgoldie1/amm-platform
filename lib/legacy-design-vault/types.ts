export type LegacyDesignDomain =
  | "spacecraft"
  | "aircraft"
  | "flying_car"
  | "marine"
  | "drone"
  | "ground_vehicle"
  | "robotics"
  | "spaceos"
  | "manufacturing_12d"
  | "energy";

export type RecoveryConfidence = "verified" | "partial" | "reference_only";

export interface LegacyDesignArtifact {
  id: string;
  designId: string;
  kind: "conversation" | "code" | "diagram" | "image" | "cad" | "stl" | "step" | "bom" | "test" | "whitepaper" | "other";
  source: string;
  checksum?: string;
  revision?: string;
  verified: boolean;
}

export interface LegacyDesignRecord {
  id: string;
  name: string;
  domain: LegacyDesignDomain;
  aliases: string[];
  summary: string;
  recoveredFacts: string[];
  unresolvedSpecs: string[];
  dependencies: string[];
  safetyRequirements: string[];
  artifacts: LegacyDesignArtifact[];
  recoveryConfidence: RecoveryConfidence;
  implementationStatus: "concept" | "prototype" | "partial" | "implemented" | "unknown";
  authoritativeSource?: string;
}
