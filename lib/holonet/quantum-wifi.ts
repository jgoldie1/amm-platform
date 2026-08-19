export type QuantumWifiTrafficClass = "safety" | "accessibility" | "realtime" | "interactive" | "media" | "bulk";

export interface QuantumWifiAccessPoint {
  id: string;
  ssid: string;
  region: string;
  healthy: boolean;
  band: "2.4ghz" | "5ghz" | "6ghz";
  channel: number;
  utilizationPercent: number;
  latencyMs: number;
  packetLossPercent: number;
  supportsWpa3: boolean;
  supports8021x: boolean;
  supportsFastRoaming: boolean;
  capabilities: string[];
}

export interface QuantumWifiClient {
  deviceId: string;
  identityVerified: boolean;
  trafficClass: QuantumWifiTrafficClass;
  preferredRegion?: string;
  requiresLowLatency?: boolean;
  requiresAccessibilityPriority?: boolean;
}

export interface QuantumWifiDecision {
  allowed: boolean;
  accessPointId?: string;
  reasons: string[];
  qosPriority: number;
}

function qosPriority(client: QuantumWifiClient): number {
  if (client.trafficClass === "safety") return 100;
  if (client.requiresAccessibilityPriority || client.trafficClass === "accessibility") return 95;
  if (client.trafficClass === "realtime") return 90;
  if (client.trafficClass === "interactive") return 75;
  if (client.trafficClass === "media") return 60;
  return 30;
}

export function selectQuantumWifiAccessPoint(
  accessPoints: QuantumWifiAccessPoint[],
  client: QuantumWifiClient,
): QuantumWifiDecision {
  const reasons: string[] = [];
  if (!client.identityVerified) {
    return { allowed: false, reasons: ["device identity is not verified"], qosPriority: 0 };
  }

  const candidates = accessPoints
    .filter((ap) => ap.healthy && ap.supportsWpa3)
    .filter((ap) => !client.requiresLowLatency || (ap.latencyMs <= 40 && ap.packetLossPercent <= 1))
    .sort((a, b) => {
      const regionA = a.region === client.preferredRegion ? -500 : 0;
      const regionB = b.region === client.preferredRegion ? -500 : 0;
      const scoreA = a.latencyMs + a.utilizationPercent + a.packetLossPercent * 25 + regionA;
      const scoreB = b.latencyMs + b.utilizationPercent + b.packetLossPercent * 25 + regionB;
      return scoreA - scoreB;
    });

  const selected = candidates[0];
  if (!selected) reasons.push("no healthy WPA3 access point meets latency/loss requirements");

  return {
    allowed: Boolean(selected),
    accessPointId: selected?.id,
    reasons,
    qosPriority: qosPriority(client),
  };
}

export function shouldRoamQuantumWifi(current: QuantumWifiAccessPoint, candidate: QuantumWifiAccessPoint): boolean {
  if (!candidate.healthy || !candidate.supportsWpa3) return false;
  const currentScore = current.latencyMs + current.utilizationPercent + current.packetLossPercent * 25;
  const candidateScore = candidate.latencyMs + candidate.utilizationPercent + candidate.packetLossPercent * 25;
  return candidate.supportsFastRoaming && candidateScore + 15 < currentScore;
}
