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
 *
 * Marketplace/e-commerce note: 2022 NAICS does not give every online
 * marketplace one universal "e-commerce" code. Classification follows the
 * actual activity (software/information platform, agent/broker, or the product
 * being retailed/wholesaled). Do not add a retail code merely because a sale
 * happens online.
 */
export const TRYAMM_NAICS_REGISTRY: readonly BusinessNaicsEntry[] = [
  {
    division: "Core Technology",
    activity: "Publish and operate TRYAMM software, applications, games and subscriptions",
    primaryNaics: "513210",
    secondaryNaics: ["518210"],
    status: "sam-now",
    notes: "Core platform code when TRYAMM publishes its own software, including game software; hosting/infrastructure is secondary when actually provided.",
  },
  {
    division: "Software & AI Services",
    activity: "Custom software, AI workflow, automation and client application development",
    primaryNaics: "541511",
    secondaryNaics: ["541512", "541519"],
    status: "sam-now",
    notes: "Use systems-design/integration codes when TRYAMM integrates customer hardware, software or communications systems.",
  },
  {
    division: "Cybersecurity / Systems Integration",
    activity: "Authorized security architecture, systems integration, recovery and related computer services",
    primaryNaics: "541512",
    secondaryNaics: ["541519", "541511"],
    status: "sam-now",
    gate: "authorized scope, security controls and contract requirements",
    notes: "NAICS does not itself certify TRYAMM for classified, FedRAMP, CMMC or other restricted work.",
  },
  {
    division: "HoloSearch / Information Portal",
    activity: "Web search/discovery portal and other information services",
    primaryNaics: "519290",
    secondaryNaics: ["513210"],
    status: "optional-now",
    gate: "operate an actual searchable information/discovery service",
    notes: "Useful for HoloSearch/search-portal activity. Census notes web portals may also provide links, auctions, news and limited content.",
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
    activity: "LIVE/social network, streaming, web broadcasting, VOD and digital media network",
    primaryNaics: "516210",
    secondaryNaics: ["512110"],
    status: "sam-now",
    gate: "content rights, music/media licensing and moderation",
    notes: "512110 is useful when TRYAMM itself produces motion-picture/video/TV programming.",
  },
  {
    division: "Film / Video Production",
    activity: "Original motion-picture, video, commercial and program production",
    primaryNaics: "512110",
    secondaryNaics: ["516210"],
    status: "optional-now",
    gate: "rights, releases, talent agreements, music clearance and production insurance as applicable",
    notes: "Use when TRYAMM is actually producing video/TV/movie content, not merely hosting uploads.",
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
    division: "Creator / Talent Management",
    activity: "Represent or manage creators, performers, athletes or other public figures",
    primaryNaics: "711410",
    secondaryNaics: ["541810"],
    status: "optional-now",
    gate: "actual management agreements, fiduciary/accounting controls and any state talent-agency requirements",
    notes: "Appropriate only if TRYAMM/StarVerse actually represents or manages talent; discovery/hosting alone does not make the platform a talent agency.",
  },
  {
    division: "Marketplace / E-Commerce Platform",
    activity: "Operate marketplace software, discovery, auctions and seller tooling without assuming ownership of every product sold",
    primaryNaics: "513210",
    secondaryNaics: ["519290", "541511"],
    status: "sam-now",
    gate: "seller verification, product rules, tax, consumer protection, refunds and prohibited-item controls",
    notes: "There is no single universal 2022 NAICS e-commerce code for every marketplace. If TRYAMM itself takes title to and retails goods, add the product-specific retail NAICS for that actual merchandise line.",
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
    division: "Advertising / Creator Business Services",
    activity: "Advertising campaigns, media planning/placement and marketing strategy",
    primaryNaics: "541810",
    secondaryNaics: ["541613"],
    status: "sam-now",
    gate: "truth-in-advertising, endorsements, sponsorship disclosures and platform ad policies",
    notes: "541613 fits consulting-only engagements; 541810 fits full advertising-agency work.",
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
    division: "Vehicle Rental / Sharing",
    activity: "Passenger-car rental when TRYAMM or an operating affiliate actually rents vehicles without drivers",
    primaryNaics: "532111",
    secondaryNaics: ["485310"],
    status: "optional-now",
    gate: "vehicle ownership/authorization, insurance, rental taxes, airport/local rules and peer-to-peer sharing requirements",
    notes: "Keep rental and rideshare classifications separate because the operating and insurance models differ.",
  },
  {
    division: "Real Estate / Property Management",
    activity: "Manage residential property for others",
    primaryNaics: "531311",
    secondaryNaics: ["531312", "531390"],
    status: "optional-now",
    gate: "state real-estate/property-management licensing and owner authorization where required",
    notes: "Use 531312 for nonresidential property management when actually performed.",
  },
  {
    division: "Real Estate Brokerage / Rental Agency",
    activity: "Act as an agent/broker selling, buying or renting real estate for others",
    primaryNaics: "531210",
    secondaryNaics: ["531311"],
    status: "future-gated",
    gate: "licensed brokerage/agent authority in each jurisdiction before performing brokerage activity",
    notes: "Property discovery/listing software alone is not the same as licensed brokerage.",
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
    division: "Financial Education / Middleverse",
    activity: "Non-degree business/financial literacy training and simulation",
    primaryNaics: "611430",
    secondaryNaics: ["611420"],
    status: "sam-now",
    gate: "paper/simulation clearly separated from regulated securities, crypto and leveraged-FX execution",
    notes: "Training classification does not grant broker-dealer, investment-adviser or exchange authority.",
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
  {
    division: "Manufacturing / Quantum Radio",
    activity: "Wireless communications/broadcast equipment manufacturing",
    primaryNaics: "334220",
    secondaryNaics: ["541330"],
    status: "future-gated",
    gate: "real manufacturing capability, QMS, RF/FCC and product-specific safety/certification",
    notes: "541330 covers engineering/design work; 334220 is for actual manufacturing operations.",
  },
  {
    division: "Healthcare / OmniCare",
    activity: "Healthcare-related platform, navigation, administration or future clinical services",
    primaryNaics: "541611",
    secondaryNaics: ["513210"],
    status: "future-gated",
    gate: "define the exact healthcare service before adding any provider/clinical/insurance NAICS; HIPAA/state licensing/insurance rules may apply",
    notes: "This placeholder intentionally classifies management/administrative consulting software activity only. Do not use a clinical or insurance-carrier NAICS until the real licensed activity is established.",
  },
];

export function getSamNowNaics(): BusinessNaicsEntry[] {
  return TRYAMM_NAICS_REGISTRY.filter((entry) => entry.status === "sam-now");
}

export function getOptionalNowNaics(): BusinessNaicsEntry[] {
  return TRYAMM_NAICS_REGISTRY.filter((entry) => entry.status === "optional-now");
}

export function getFutureGatedNaics(): BusinessNaicsEntry[] {
  return TRYAMM_NAICS_REGISTRY.filter((entry) => entry.status === "future-gated");
}

export function getUniqueNaicsCodes(entries: readonly BusinessNaicsEntry[] = TRYAMM_NAICS_REGISTRY): string[] {
  return Array.from(new Set(entries.flatMap((entry) => [entry.primaryNaics, ...(entry.secondaryNaics ?? [])]))).sort();
}

export function findNaicsByDivision(query: string): BusinessNaicsEntry[] {
  const needle = query.trim().toLowerCase();
  return TRYAMM_NAICS_REGISTRY.filter(
    (entry) => entry.division.toLowerCase().includes(needle) || entry.activity.toLowerCase().includes(needle),
  );
}
