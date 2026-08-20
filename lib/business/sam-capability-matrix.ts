export type SamReadiness = 'ready-to-bid' | 'operating-optional' | 'definition-required' | 'future-gated';

export interface SamCapability {
  division: string;
  offer: string;
  naics: string[];
  readiness: SamReadiness;
  evidenceNeeded: string[];
  regulatoryGate?: string;
  samPositioning: string;
}

/**
 * SAM.gov capability matrix.
 *
 * Rule: NAICS describes actual offered/performed business activity; it does not
 * create a license. Regulated lines remain definition-required/future-gated
 * until the exact service, jurisdiction, operating model and approvals are
 * documented. This avoids asserting an overly broad code just because TRYAMM
 * has a product concept in that domain.
 */
export const TRYAMM_SAM_CAPABILITIES: readonly SamCapability[] = [
  {
    division: 'Core Technology',
    offer: 'TRYAMM software platform licensing/subscriptions and software publishing',
    naics: ['513210'],
    readiness: 'ready-to-bid',
    evidenceNeeded: ['working application', 'technical capability statement', 'security architecture', 'pricing method'],
    samPositioning: 'Primary technology capability: software publishing and delivery of TRYAMM-owned applications.',
  },
  {
    division: 'Software / AI Services',
    offer: 'Custom software, AI workflow automation, application development and systems integration',
    naics: ['541511', '541512', '541519'],
    readiness: 'ready-to-bid',
    evidenceNeeded: ['software portfolio', 'development process', 'testing/CI evidence', 'past-performance narrative when available'],
    samPositioning: 'Use when a solicitation asks TRYAMM to design, build, integrate or maintain customer software/systems.',
  },
  {
    division: 'Cybersecurity',
    offer: 'Authorized security architecture, system hardening, security integration and technical support',
    naics: ['541512', '541519'],
    readiness: 'ready-to-bid',
    evidenceNeeded: ['authorized testing policy', 'security controls', 'staff qualifications appropriate to solicitation'],
    regulatoryGate: 'Do not claim FedRAMP, CMMC, classified clearance or other certification unless actually obtained.',
    samPositioning: 'Security engineering and integration only within authorized contractual scope.',
  },
  {
    division: 'AI Contact Center',
    offer: 'Customer support, answering, inbound/outbound contact-center services and AI-assisted agent workflows',
    naics: ['561422', '561421'],
    readiness: 'ready-to-bid',
    evidenceNeeded: ['telephony provider', 'DNC/TCPA controls', 'recording consent controls', 'QA and escalation procedures'],
    regulatoryGate: 'Campaign-specific consent, DNC, recording and telemarketing rules remain separate from NAICS.',
    samPositioning: 'Contact-center operations and customer support, including AI-assisted workflows.',
  },
  {
    division: 'Media / LIVE / Free TV',
    offer: 'Internet streaming, social/live broadcasting, VOD and digital media network operations',
    naics: ['516210'],
    readiness: 'ready-to-bid',
    evidenceNeeded: ['streaming capability', 'content moderation', 'caption/accessibility support', 'rights workflow'],
    regulatoryGate: 'Music, film, broadcast and territory rights must be cleared for distributed content.',
    samPositioning: 'Digital media delivery and Internet broadcasting capability.',
  },
  {
    division: 'Film / Video Production',
    offer: 'Video, commercial, program, music-video and digital production services',
    naics: ['512110'],
    readiness: 'operating-optional',
    evidenceNeeded: ['production samples', 'crew/equipment plan', 'rights releases', 'production insurance where needed'],
    samPositioning: 'Add when TRYAMM is actively offering production services, not only hosting third-party video.',
  },
  {
    division: 'Music / Studio',
    offer: 'Recording-studio services and authorized record production/distribution',
    naics: ['512240', '512250'],
    readiness: 'operating-optional',
    evidenceNeeded: ['studio workflow', 'recording capability', 'artist/master/publishing agreements', 'royalty accounting'],
    samPositioning: 'Use only when TRYAMM is actually providing studio/record-production services.',
  },
  {
    division: 'Training / Academy',
    offer: 'Computer/software training and professional/business development training',
    naics: ['611420', '611430'],
    readiness: 'ready-to-bid',
    evidenceNeeded: ['curriculum', 'learning objectives', 'instructor/AI-assistant controls', 'accessibility plan'],
    regulatoryGate: 'Do not market non-accredited training as an accredited degree or credential.',
    samPositioning: 'Stubbs AI Academy, software training and professional development services.',
  },
  {
    division: 'Advertising / Marketing',
    offer: 'Advertising campaigns, creative services, media planning and marketing consulting',
    naics: ['541810', '541613'],
    readiness: 'ready-to-bid',
    evidenceNeeded: ['campaign workflow', 'creative portfolio', 'measurement/reporting', 'disclosure controls'],
    samPositioning: 'Full-service advertising where TRYAMM executes campaigns; consulting code where advice is the service.',
  },
  {
    division: 'HoloSearch / Information Portal',
    offer: 'Search/information portal, searchable discovery and related information services',
    naics: ['519290'],
    readiness: 'operating-optional',
    evidenceNeeded: ['search/discovery product', 'index/content policy', 'privacy and moderation controls'],
    samPositioning: 'Use for genuine search/information-portal operations; do not use as a generic catch-all for every web business.',
  },
  {
    division: 'Marketplace / E-commerce Platform',
    offer: 'Digital marketplace, storefront, auction/live-shopping and seller tools',
    naics: [],
    readiness: 'definition-required',
    evidenceNeeded: ['merchant-of-record model', 'seller-of-record model', 'what goods/services TRYAMM itself sells', 'commission/agency model'],
    regulatoryGate: '2022 NAICS classifies retail by the actual merchandise/activity; there is no single universal e-commerce NAICS code for every marketplace model.',
    samPositioning: 'Do not force a generic retail code. Select solicitation/activity-specific codes after the exact operating role is documented.',
  },
  {
    division: 'Creator / Talent Management',
    offer: 'Representation/management services for creators, artists or entertainers',
    naics: ['711410'],
    readiness: 'operating-optional',
    evidenceNeeded: ['management agreements', 'commission disclosures', 'rights/authorization records'],
    samPositioning: 'Use only when TRYAMM actually manages/represents talent rather than merely hosting creator accounts.',
  },
  {
    division: 'Logistics / Freight',
    offer: 'Freight arrangement/dispatch and logistics consulting',
    naics: ['488510', '541614'],
    readiness: 'operating-optional',
    evidenceNeeded: ['operating model', 'carrier/shipper agreements', 'insurance', 'authority determination'],
    regulatoryGate: 'FMCSA broker/forwarder or other transportation authority may be required depending on the actual service.',
    samPositioning: 'Separate freight arrangement from consulting; do not describe regulated brokerage as mere software if TRYAMM actually arranges transportation.',
  },
  {
    division: 'Rideshare / Mobility',
    offer: 'Ride-hailing/ridesharing arrangement platform',
    naics: ['485310'],
    readiness: 'operating-optional',
    evidenceNeeded: ['TNC operating model', 'driver checks', 'insurance/protection', 'vehicle safety', 'airport/local rules'],
    regulatoryGate: 'State/local TNC and transportation requirements must be satisfied before live service.',
    samPositioning: 'Add when mobility operations are actually being offered/performed.',
  },
  {
    division: 'Vehicle Rental / Sharing',
    offer: 'Passenger-car rental without drivers or peer-to-peer vehicle-sharing platform services',
    naics: ['532111'],
    readiness: 'operating-optional',
    evidenceNeeded: ['ownership/platform role', 'insurance/protection plan', 'driver verification', 'claims/tax rules'],
    regulatoryGate: 'Peer-to-peer car sharing can have separate state insurance, airport, tax and consumer-protection rules.',
    samPositioning: 'Use only when the actual rental/sharing operation fits the classification.',
  },
  {
    division: 'Property Management',
    offer: 'Residential property management for owners',
    naics: ['531311'],
    readiness: 'operating-optional',
    evidenceNeeded: ['owner authorization', 'property-management operating model', 'state license determination'],
    regulatoryGate: 'State licensing requirements vary; property management is not the same as brokerage or property ownership.',
    samPositioning: 'Use for management-for-others activity when legally permitted.',
  },
  {
    division: 'Real Estate Brokerage',
    offer: 'Broker/agent representation in buying, selling or leasing real property',
    naics: ['531210'],
    readiness: 'future-gated',
    evidenceNeeded: ['licensed broker structure', 'state authorizations', 'agency disclosures'],
    regulatoryGate: 'Do not assert brokerage services unless TRYAMM/the responsible entity is properly licensed.',
    samPositioning: 'Keep separate from PropertyVerse software/search and property-management features.',
  },
  {
    division: 'FinTech / Payment Processing',
    offer: 'Financial transaction processing performed by TRYAMM itself',
    naics: ['522320'],
    readiness: 'future-gated',
    evidenceNeeded: ['exact funds-flow diagram', 'merchant/provider contracts', 'custody/stored-value determination', 'AML/KYC/sanctions model', 'state/federal licensing analysis'],
    regulatoryGate: 'Using Stripe, Paystack or Flutterwave as payment providers does not by itself make TRYAMM a 522320 processor.',
    samPositioning: 'Do not center SAM positioning on 522320 unless TRYAMM actually performs qualifying processing activity.',
  },
  {
    division: 'Middleverse Financial Education',
    offer: 'Paper-trading, budgeting, credit and investment-literacy training',
    naics: ['611430'],
    readiness: 'ready-to-bid',
    evidenceNeeded: ['educational curriculum', 'paper-trading separation', 'no-real-investment execution controls'],
    regulatoryGate: 'Real securities, crypto and leveraged FX execution stay outside the training product until separately approved.',
    samPositioning: 'Education/simulation product, not brokerage or investment-advisory authority.',
  },
  {
    division: 'Healthcare / OmniCare',
    offer: 'Healthcare-related technology/administrative platform',
    naics: [],
    readiness: 'definition-required',
    evidenceNeeded: ['exact service definition', 'whether TRYAMM provides care vs software vs claims/admin vs scheduling', 'HIPAA/business-associate analysis', 'state licensing analysis'],
    regulatoryGate: 'No healthcare NAICS should be asserted from a broad OmniCare concept alone; the exact service determines the classification and licensing obligations.',
    samPositioning: 'Keep healthcare future/conditional until the operational service is specifically defined and reviewed.',
  },
  {
    division: 'Engineering / Robotics',
    offer: 'Engineering design, robotics automation and manufacturing-system integration',
    naics: ['541330'],
    readiness: 'operating-optional',
    evidenceNeeded: ['engineering deliverables', 'qualified personnel', 'safety/QMS process'],
    regulatoryGate: 'Professional-engineering or product-specific requirements may apply by contract/jurisdiction.',
    samPositioning: 'Use for actual engineering services and robotics/automation design work.',
  },
  {
    division: 'Wireless / Quantum Radio Manufacturing',
    offer: 'Wireless communications/broadcast equipment manufacturing',
    naics: ['334220'],
    readiness: 'future-gated',
    evidenceNeeded: ['schematics/PCB', 'approved BOM', 'factory/QMS', 'RF/thermal/power validation', 'certification matrix'],
    regulatoryGate: 'Manufacturing capability and product certifications must be real before this is represented as an operating manufacturing line.',
    samPositioning: 'Engineering prototypes can precede manufacturing; do not conflate prototype design with production capacity.',
  },
];

export function samReadyToBid(): SamCapability[] {
  return TRYAMM_SAM_CAPABILITIES.filter((x) => x.readiness === 'ready-to-bid');
}

export function samDefinitionRequired(): SamCapability[] {
  return TRYAMM_SAM_CAPABILITIES.filter((x) => x.readiness === 'definition-required');
}

export function samFutureGated(): SamCapability[] {
  return TRYAMM_SAM_CAPABILITIES.filter((x) => x.readiness === 'future-gated');
}

export function uniqueSamNaics(): string[] {
  return [...new Set(TRYAMM_SAM_CAPABILITIES.flatMap((x) => x.naics))].sort();
}
