export type ImmersiveTarget = "phone" | "tablet" | "tv" | "browser" | "vr" | "ar" | "mr" | "gamepad";
export type LinkTransport = "bluetooth" | "webrtc" | "wifi" | "local_network" | "cast" | "usb";

export interface QuantumBeatSession {
  id: string;
  ownerId: string;
  sourceDeviceId: string;
  target: ImmersiveTarget;
  transport: LinkTransport;
  role: "display" | "controller" | "audio" | "haptics" | "sensor";
  latencyBudgetMs: number;
  locale?: string;
  accessibility?: {
    oneHand?: boolean;
    voice?: boolean;
    switchControl?: boolean;
    captions?: boolean;
    haptics?: boolean;
    reducedMotion?: boolean;
  };
}

export interface QuantumBeatDecision {
  allowed: boolean;
  mode: "normal" | "degraded" | "blocked";
  requirements: string[];
  reasons: string[];
}

export function evaluateQuantumBeatSession(session: QuantumBeatSession): QuantumBeatDecision {
  const reasons: string[] = [];
  const requirements = [
    "authenticate both endpoints",
    "negotiate encrypted session keys",
    "measure latency before control begins",
    "preserve accessibility preferences across endpoints",
    "disconnect or degrade safely when transport health fails",
  ];

  if (session.latencyBudgetMs <= 0) reasons.push("invalid latency budget");
  if (session.role === "controller" && session.target === "tv") {
    requirements.push("keep authoritative game state on the game/session server, not the TV client");
  }
  if (["vr", "ar", "mr"].includes(session.target)) {
    requirements.push("apply comfort, boundary, reduced-motion and guardian safety settings");
  }

  return {
    allowed: reasons.length === 0,
    mode: reasons.length ? "blocked" : "normal",
    requirements,
    reasons,
  };
}
