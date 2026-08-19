export type RecoveryStage =
  | "recovered"
  | "source_verified"
  | "spec_reconstructed"
  | "digital_twin"
  | "simulation_tested"
  | "prototype"
  | "independently_verified"
  | "production_candidate";

export interface RecoveryTransitionInput {
  current: RecoveryStage;
  requested: RecoveryStage;
  hasAuthoritativeSource: boolean;
  hasSpecification: boolean;
  hasDigitalTwin: boolean;
  simulationPassed: boolean;
  hasPrototype: boolean;
  independentVerificationPassed: boolean;
  productionSafetyGatePassed: boolean;
}

const order: RecoveryStage[] = [
  "recovered",
  "source_verified",
  "spec_reconstructed",
  "digital_twin",
  "simulation_tested",
  "prototype",
  "independently_verified",
  "production_candidate",
];

export function evaluateRecoveryTransition(input: RecoveryTransitionInput) {
  const currentIndex = order.indexOf(input.current);
  const requestedIndex = order.indexOf(input.requested);
  const reasons: string[] = [];

  if (requestedIndex < currentIndex) {
    return { allowed: true, reasons: ["rollback/demotion is allowed for evidence correction"] };
  }
  if (requestedIndex > currentIndex + 1) {
    reasons.push("recovery stages must advance sequentially");
  }
  if (requestedIndex >= order.indexOf("source_verified") && !input.hasAuthoritativeSource) reasons.push("authoritative source evidence required");
  if (requestedIndex >= order.indexOf("spec_reconstructed") && !input.hasSpecification) reasons.push("reconstructed specification required");
  if (requestedIndex >= order.indexOf("digital_twin") && !input.hasDigitalTwin) reasons.push("digital twin required");
  if (requestedIndex >= order.indexOf("simulation_tested") && !input.simulationPassed) reasons.push("simulation evidence required");
  if (requestedIndex >= order.indexOf("prototype") && !input.hasPrototype) reasons.push("prototype evidence required");
  if (requestedIndex >= order.indexOf("independently_verified") && !input.independentVerificationPassed) reasons.push("independent verification required");
  if (requestedIndex >= order.indexOf("production_candidate") && !input.productionSafetyGatePassed) reasons.push("production safety gate required");

  return { allowed: reasons.length === 0, reasons };
}
