export type LegacyMobilityConceptId =
  | "silver-hawk-flying-car"
  | "tryamm-aircraft-platform"
  | "tryamm-marine-platform"
  | "tryamm-12d-manufactured-mobility";

export interface LegacyMobilityConcept {
  id: LegacyMobilityConceptId;
  name: string;
  category: "flying_car" | "aircraft" | "marine" | "manufacturing";
  status: "legacy_design_recovered" | "specs_incomplete";
  verifiedProjectHistory: string[];
  restorationNotes: string[];
}

export const LEGACY_MOBILITY_CONCEPTS: LegacyMobilityConcept[] = [
  {
    id: "silver-hawk-flying-car",
    name: "Silver Hawk Flying Car",
    category: "flying_car",
    status: "legacy_design_recovered",
    verifiedProjectHistory: [
      "Previously defined in the TRYAMM hardware/mobility roadmap as a flying-car concept.",
      "Now restored under MobilityOS rather than treated as a standalone project.",
    ],
    restorationNotes: [
      "Retain legacy branding while rebuilding missing engineering specifications from source material when recovered.",
      "Physical flight control remains outside the LLM and behind deterministic certified controllers.",
    ],
  },
  {
    id: "tryamm-aircraft-platform",
    name: "TRYAMM Aircraft Platform",
    category: "aircraft",
    status: "specs_incomplete",
    verifiedProjectHistory: [
      "User confirms a prior flying-plane concept was created in earlier project work.",
    ],
    restorationNotes: [
      "Exact legacy dimensions, propulsion and airframe specifications are not present in the current repository.",
      "Restore recovered specifications when source files or archived text become available.",
    ],
  },
  {
    id: "tryamm-marine-platform",
    name: "TRYAMM Marine / Boat Platform",
    category: "marine",
    status: "specs_incomplete",
    verifiedProjectHistory: [
      "User confirms a prior boat/marine concept was created in earlier project work.",
    ],
    restorationNotes: [
      "Integrate routing, docking, fleet, accessibility, energy and mission handoff through MobilityOS.",
      "Exact legacy hull and propulsion specifications remain to be recovered from original source material.",
    ],
  },
  {
    id: "tryamm-12d-manufactured-mobility",
    name: "TRYAMM 12D-Printed Mobility Manufacturing",
    category: "manufacturing",
    status: "legacy_design_recovered",
    verifiedProjectHistory: [
      "The broader TRYAMM/quantum architecture previously included 12D-printer concepts.",
      "SpaceOS already uses a safety-gated CAD/STL/STEP manufacturing workflow as a locked baseline.",
    ],
    restorationNotes: [
      "Treat 12D printing as a project manufacturing architecture/brand term unless a specific physical 12-dimensional fabrication process is demonstrated.",
      "Use digital-twin validation, CAD/STEP source of truth, material/process records and safety/certification gates before physical fabrication.",
    ],
  },
];
