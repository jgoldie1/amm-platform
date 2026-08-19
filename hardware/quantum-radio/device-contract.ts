export type QuantumRadioRole = "home_edge" | "venue" | "mobility" | "community_mesh" | "datacenter_edge";

export interface QuantumRadioCapabilities {
  wifi24: boolean;
  wifi5: boolean;
  wifi6: boolean;
  bluetoothLe: boolean;
  uwb: boolean;
  ethernet: boolean;
  poe: boolean;
  fpga: boolean;
  secureElement: boolean;
  qrng: boolean;
  gnssTiming: boolean;
}

export interface QuantumRadioHealth {
  deviceId: string;
  role: QuantumRadioRole;
  firmwareVersion: string;
  secureBootVerified: boolean;
  certificateValid: boolean;
  regulatoryProfile: string;
  temperatureC?: number;
  cpuPercent?: number;
  memoryPercent?: number;
  uplinkLatencyMs?: number;
  packetLossPercent?: number;
  capabilities: QuantumRadioCapabilities;
}

export interface QuantumRadioReadiness {
  ready: boolean;
  reasons: string[];
}

export function evaluateQuantumRadioReadiness(health: QuantumRadioHealth): QuantumRadioReadiness {
  const reasons: string[] = [];
  if (!health.secureBootVerified) reasons.push("secure boot is not verified");
  if (!health.certificateValid) reasons.push("Holo Identity certificate is invalid");
  if (!health.regulatoryProfile) reasons.push("RF regulatory profile is missing");
  if (!health.capabilities.secureElement) reasons.push("secure element/TPM is required");
  if (!health.capabilities.ethernet) reasons.push("wired backhaul capability is required for v1 production nodes");
  if ((health.temperatureC ?? 0) > 85) reasons.push("device is above thermal operating threshold");
  if ((health.packetLossPercent ?? 0) > 2) reasons.push("packet loss is above protected threshold");
  return { ready: reasons.length === 0, reasons };
}
