import type { LegacyDesignRecord } from "./types";

/**
 * Recovery record for the previously discussed TRYAMM/SpaceOS spacecraft.
 * Only facts supported by preserved project context are recorded as recovered.
 * Unknown propulsion, dimensions, materials and performance remain unresolved
 * until an authoritative prior artifact is recovered.
 */
export const recoveredTryammSpacecraft: LegacyDesignRecord = {
  id: "legacy-spacecraft-tryamm-spaceos-001",
  name: "TRYAMM SpaceOS Spacecraft",
  domain: "spacecraft",
  aliases: ["El Saturn spacecraft", "TRYAMM spaceship", "SpaceOS spacecraft"],
  summary:
    "Recovered spacecraft program intended to connect TRYAMM/El Saturn, SpaceOS, immersive cockpit operation, planetary travel, Mars missions, navigation, multiplayer crews, persistent missions and safety-gated manufacturing.",
  recoveredFacts: [
    "Cockpit controls were part of the prior spacecraft/game-system design.",
    "Animated launches were requested.",
    "Controllable flight was requested.",
    "Planetary travel was requested.",
    "Mars terrain and missions were requested.",
    "Atmospheric entry and landing were requested.",
    "SPICE navigation integration was requested.",
    "Multiplayer crews were requested.",
    "Mission saving/persistence was requested.",
    "Stubbs AI guidance was requested for the spacecraft experience.",
    "SpaceOS uses persistent digital twins and a safety-gated BUILD/manufacturing workflow.",
    "The broader manufacturing architecture includes STL/STEP/CAD outputs and a 12D-manufacturing concept.",
  ],
  unresolvedSpecs: [
    "authoritative spacecraft name/model designation",
    "airframe/hull geometry and dimensions",
    "propulsion architecture",
    "power source and energy-storage specification",
    "crew capacity and life-support specification",
    "materials and structural stack",
    "thermal protection system",
    "guidance/navigation/control implementation details",
    "validated performance envelope",
    "physical manufacturing BOM and certified process",
  ],
  dependencies: [
    "Stubbs AI",
    "Hierarchy AGI",
    "Googolplex Memory",
    "Quantum Speed Engine",
    "Quantum Lag Buster",
    "Guardian safety layer",
    "SpaceOS digital twin",
    "SPICE navigation adapter",
    "mission persistence",
    "multiplayer crew state",
    "ManufacturingOS safety-gated BUILD",
  ],
  safetyRequirements: [
    "Simulation must be clearly separated from physical vehicle authorization.",
    "LLMs may plan or explain but may not directly control physical propulsion, flight surfaces or actuators.",
    "Physical designs require independent structural, thermal, electrical, materials, controls and regulatory verification.",
    "Unknown legacy specifications must remain unknown until supported by a recovered source artifact.",
  ],
  artifacts: [],
  recoveryConfidence: "partial",
  implementationStatus: "partial",
};
