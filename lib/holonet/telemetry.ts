export interface HoloNetTelemetrySample {
  nodeId: string;
  serviceId: string;
  timestamp: string;
  latencyMs: number;
  errorRate: number;
  requestsPerSecond: number;
  cpuPercent?: number;
  memoryPercent?: number;
  packetLossPercent?: number;
}

export interface HoloNetHealthDecision {
  healthy: boolean;
  degraded: boolean;
  reasons: string[];
}

export function evaluateHoloNetHealth(sample: HoloNetTelemetrySample): HoloNetHealthDecision {
  const reasons: string[] = [];
  if (sample.errorRate > 0.05) reasons.push("error rate above 5%");
  if (sample.latencyMs > 750) reasons.push("latency above protected threshold");
  if ((sample.packetLossPercent ?? 0) > 2) reasons.push("packet loss above 2%");
  if ((sample.cpuPercent ?? 0) > 90) reasons.push("CPU saturation");
  if ((sample.memoryPercent ?? 0) > 90) reasons.push("memory saturation");
  return { healthy: reasons.length === 0, degraded: reasons.length > 0, reasons };
}
