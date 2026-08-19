export type SenseChannel = "vision" | "hearing" | "touch" | "smell" | "taste";

export interface SenseObservation {
  channel: SenseChannel;
  source: string;
  confidence: number;
  capturedAt: string;
  payload: unknown;
  simulated?: boolean;
}

export interface FusedPerception {
  observations: SenseObservation[];
  availableChannels: SenseChannel[];
  missingChannels: SenseChannel[];
  warnings: string[];
}

const ALL_SENSES: SenseChannel[] = ["vision", "hearing", "touch", "smell", "taste"];

export function fuseFiveSenseObservations(
  observations: SenseObservation[],
): FusedPerception {
  const availableChannels = Array.from(
    new Set(observations.map((observation) => observation.channel)),
  );
  const missingChannels = ALL_SENSES.filter(
    (channel) => !availableChannels.includes(channel),
  );

  const warnings: string[] = [];
  if (observations.some((observation) => observation.confidence < 0.5)) {
    warnings.push("One or more perception channels are low confidence.");
  }
  if (observations.some((observation) => observation.simulated)) {
    warnings.push("Simulated sensory data must not be treated as a physical-world measurement.");
  }

  return {
    observations,
    availableChannels,
    missingChannels,
    warnings,
  };
}

export function senseIsAvailable(
  perception: FusedPerception,
  channel: SenseChannel,
): boolean {
  return perception.availableChannels.includes(channel);
}
