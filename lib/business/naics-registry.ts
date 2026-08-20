export type NaicsLaunchStatus = "sam-now" | "optional-now" | "future-gated";

export interface BusinessNaicsEntry {
  division: string;
  activity: string;
  primaryNaics: string;
  secondaryNaics?: string[];
  status: NaicsLaunchStatus;
  gate?: string;
  notes: string;
}

/**
 * TRYAMM 2022 NAICS working registry.
 *
 * IMPORTANT: NAICS codes classify actual business activity; they do not grant
 * licenses or regulatory authority. SAM assertions must match services the
 * registered entity genuinely provides or is prepared to bid/perform.
 */
export const TRYAMM_NAICS_REGISTRY: readonly BusinessNaicsEntry[] = [
  {
    division: "Core Technology",
    activity: "Publish and operate TRYAMM software/app subscriptions",
    primaryNaics: "513210",
    secondaryNaics: ["518210"],
    status: "sam-now",
    notes: "Best core platform code when TRYAMM publishes its own software; hosting/infrastructure is secondary when actually provided.",
  },
  {
    division: "Software & AI Services",
    activity: "Custom software, AI workflow and client application development",
    primaryNaics: "541511",
    secondaryNaics: ["541512", "541519"],
    status: "sam-now",
    notes: "Use systems-design code when TRYAMM integrates hardware/software/communications for customers.",
  },
  {
    division: "AI Call Center",
    activity: "Contact-center, answering, customer-support and authorized outbound services for clients",
    primaryNaics: "561422",
    secondaryNaics: ["561421"],
    status: "sam-now",
    gate: "TCPA/DNC/consent, call-recording and client campaign controls",
    notes: "Do not treat NAICS classification as permission to telemarket; campaign compliance remains separate.",
  },
  {
    division: "Streaming / Social / Free TV",
    activity: "LIVE/social network, streaming, web broadcasting, VOD and media network",
    primaryNaics: "516210",
    secondaryNaics: ["512110"],
    status: "sam-now",
    gate: "content rights, music/media licensing and moderation",
    notes: "512110 is useful when TRYAMM itself produces motion-picture/video/TV programming.",
  },
  {
    division: "Music / 64-Track Studio",
    activity: "Recording studio and authorized record production/distribution",
    primaryNaics: "512240",
    secondaryNaics: ["512250"],
    status: "optional-now",
    gate: "artist/master/publishing rights and royalty accounting",
    notes: "Use only for actual studio/record-production operations.",
  },
  {
    division: "Cybersecurity / Systems Integration",
    activity: "Security architecture, systems integration, disaster recovery and related computer services",
    primaryNaics: "541512",
    secondaryNaics: ["541519", "541511"],
    status: "sam-now",
    gate: "authorized scope, security controls and contract requirements",
    notes: "NAICS does not itself certify TRYAMM for classified, FedRAMP, CMMC or other restricted work.",
  },
  {
    division: "Education / Stubbs AI Academy",
    activity: "Computer/software training and professional/business development training",
    primaryNaics: "611420",
    secondaryNaics: ["611430"],
    status: "sam-now",
    gate: "do not represent non-accredited programs as accredited degrees",
    notes: "Supports software training plus professional/management development courses and simulations.",
  },
  {
    division: "Logistics / Freight",
    activity: "Arrange freight between shippers and carriers / freight-forwarding style services",
    primaryNaics: "488510",
    secondaryNaics: ["541614"],
    status: "optional-now",
    gate: "FMCSA/broker or other transport authority when legally required for the actual service",
    notes: "Use 541614 when the business is logistics consulting rather than arranging transportation.",
  },
  {
    division: "Rideshare / Mobility",
    activity: "Ride-hailing/ridesharing arrangement and passenger transportation platform",
    primaryNaics: "485310",
    secondaryNaics: ["532111"],
    status: "optional-now",
    gate: "state/local TNC, driver, insurance, safety and airport requirements",
    notes: "532111 applies to passenger-car rental without drivers; it is not a substitute for rideshare rules.",
  },
  {
    division: "Real Estate / PropertyVerse",
    activity: "Manage residential property for others",
    primaryNaics: "531311",
    status: "optional-now",
    gate: "state real-estate/property-management licensing and owner authorization where required",
    notes: "Property listing, brokerage, ownership/lessor and management activities can require different codes; do not claim brokerage unless licensed.",
  },
  {
    division: "Advertising / Creator Business Services",
    activity: "Advertising campaigns, media planning/placement and marketing strategy",
    primaryNaics: "541810",
    secondaryNaics: ["541613"],
    status: "sam-now",
    gate: "truth-in-advertising, endorsements, sponsorship disclosures and platform ad policies",
    notes: "541613 fits consulting-only engagements; 541810 fits full advertising-agency work.",
  },
  {
    division: "FinTech / Payments",
    activity: "Financial transaction processing where TRYAMM actually performs qualifying processing activity",
    primaryNaics: "522320",
    secondaryNaics: ["518210"],
    status: "future-gated",
    gate: "provider contracts plus payments, money-transmission/stored-value, AML/KYC, sanctions and jurisdiction review as applicable",
    notes: "Using Stripe/Paystack/Flutterwave as a merchant does not automatically mean TRYAMM itself is a 522320 processor.",
  },
  {
    division: "Manufacturing / Quantum Radio",
    activity: "Wireless communications/broadcast equipment manufacturing",
    primaryNaics: "334220",
    secondaryNaics: ["541330"],
    status: "future-gated",
    gate: "real manufacturing capability, QMS, RF/FCC and product-specific safety/certification",
    notes: "541330 covers engineering/design work including robotics automation; 334220 is for actual manufacturing operations.",
  },
  {
    division: "Robotics / Industrial Engineering",
    activity: "Engineering, robotics automation design and manufacturing-system integration",
    primaryNaics: "541330",
    secondaryNaics: ["541512"],
    status: "optional-now",
    gate: "professional/safety requirements appropriate to the contract and jurisdiction",
    notes: "Use for actual engineering services, not merely a future factory concept.",
  },
];

export function getSamNowNaics(): BusinessNaicsEntry[] {
  return TRYAMM_NAICS_REGISTRY.filter((entry) => entry.status === "sam-now");
}

export function getFutureGatedNaics(): BusinessNaicsEntry[] {
  return TRYAMM_NAICS_REGISTRY.filter((entry) => entry.status === "future-gated");
}

export function findNaicsByDivision(query: string): BusinessNaicsEntry[] {
  const needle = query.trim().toLowerCase();
  return TRYAMM_NAICS_REGISTRY.filter(
    (entry) => entry.division.toLowerCase().includes(needle) || entry.activity.toLowerCase().includes(needle),
  );
}
