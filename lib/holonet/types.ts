export type HoloNetServiceKind =
  | "search"
  | "advertising"
  | "messaging"
  | "media"
  | "realtime"
  | "commerce"
  | "payments"
  | "games"
  | "ai"
  | "mobility"
  | "space"
  | "identity"
  | "storage";

export interface HoloNetService {
  id: string;
  name: string;
  kind: HoloNetServiceKind;
  endpoint: string;
  public: boolean;
  version: string;
  capabilities: string[];
  healthPath?: string;
}

export interface HoloNetIdentity {
  subjectId: string;
  type: "user" | "creator" | "provider" | "service" | "device" | "world";
  publicKeyId?: string;
  roles: string[];
}

export interface HoloNetEnvelope<T = unknown> {
  id: string;
  source: string;
  destination: string;
  type: string;
  createdAt: string;
  traceId: string;
  actor?: HoloNetIdentity;
  payload: T;
  signature?: string;
  signatureAlgorithm?: string;
}

export interface HoloNetRouteDecision {
  allowed: boolean;
  destination?: HoloNetService;
  reasons: string[];
  requiresSignature: boolean;
  requiresAudit: boolean;
}
