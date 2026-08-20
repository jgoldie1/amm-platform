export type AcademyTrack =
  | "tryamm_onboarding"
  | "creator_live"
  | "marketplace_seller"
  | "hologpt_holoforge"
  | "financial_basics"
  | "credit"
  | "bills_budgeting"
  | "middleverse_markets"
  | "forex"
  | "small_business";

export interface AcademyLesson {
  id: string;
  track: AcademyTrack;
  title: string;
  objective: string;
  estimatedMinutes: number;
  prerequisites: string[];
  practiceMode: "guided" | "simulation" | "checklist";
  regulatedBoundary?: string;
}

export interface AcademyProgress {
  userId: string;
  completedLessonIds: string[];
  activeLessonId?: string;
  updatedAt: string;
}

export const academyLessons: AcademyLesson[] = [
  {
    id: "onboard-home",
    track: "tryamm_onboarding",
    title: "Find your way around TRYAMM",
    objective: "Use Home, Feed, LIVE, Create, Marketplace, Stubbs AI, Wallet and Settings safely.",
    estimatedMinutes: 6,
    prerequisites: [],
    practiceMode: "guided",
  },
  {
    id: "onboard-live",
    track: "creator_live",
    title: "Go LIVE safely",
    objective: "Start a room, confirm camera/mic, use chat/moderation, end the room and verify presence clears.",
    estimatedMinutes: 10,
    prerequisites: ["onboard-home"],
    practiceMode: "guided",
  },
  {
    id: "seller-basics",
    track: "marketplace_seller",
    title: "Sell products and services",
    objective: "Create a listing, understand checkout, fulfillment, refunds and creator/platform accounting.",
    estimatedMinutes: 12,
    prerequisites: ["onboard-home"],
    practiceMode: "checklist",
  },
  {
    id: "holoforge-basics",
    track: "hologpt_holoforge",
    title: "Create with HoloGPT and HoloForge",
    objective: "Use credits, generate authorized assets, review output, save and publish through approved workflows.",
    estimatedMinutes: 12,
    prerequisites: ["onboard-home"],
    practiceMode: "guided",
  },
  {
    id: "money-map",
    track: "financial_basics",
    title: "Map your money",
    objective: "Separate income, required bills, flexible spending, debt payments, savings and goals.",
    estimatedMinutes: 10,
    prerequisites: [],
    practiceMode: "checklist",
  },
  {
    id: "bills-calendar",
    track: "bills_budgeting",
    title: "Build a bill calendar",
    objective: "Organize due dates, minimums, autopay preferences and reminders without moving money automatically.",
    estimatedMinutes: 10,
    prerequisites: ["money-map"],
    practiceMode: "guided",
  },
  {
    id: "budget-buffer",
    track: "bills_budgeting",
    title: "Build a spending buffer",
    objective: "Practice allocating income between bills, emergency savings, flexible spending and goals.",
    estimatedMinutes: 12,
    prerequisites: ["money-map"],
    practiceMode: "simulation",
  },
  {
    id: "credit-basics",
    track: "credit",
    title: "Understand credit",
    objective: "Learn payment history, utilization, inquiries, account age, derogatory events and dispute basics.",
    estimatedMinutes: 14,
    prerequisites: ["money-map"],
    practiceMode: "guided",
  },
  {
    id: "paper-market-101",
    track: "middleverse_markets",
    title: "Paper trading 101",
    objective: "Place simulated market/limit orders and understand positions, cost basis and unrealized P&L.",
    estimatedMinutes: 15,
    prerequisites: ["money-map"],
    practiceMode: "simulation",
    regulatedBoundary: "Simulation only. No real securities execution or investment recommendation.",
  },
  {
    id: "fractional-etf-lab",
    track: "middleverse_markets",
    title: "Fractional shares and ETF basket lab",
    objective: "Build a simulated diversified basket, validate weights and compare concentration risk.",
    estimatedMinutes: 18,
    prerequisites: ["paper-market-101"],
    practiceMode: "simulation",
    regulatedBoundary: "Educational simulated basket; not a registered ETF or security offering.",
  },
  {
    id: "stress-test",
    track: "middleverse_markets",
    title: "Quantum market stress test",
    objective: "Apply recession, inflation, sector and currency shocks and explain the portfolio response.",
    estimatedMinutes: 16,
    prerequisites: ["fractional-etf-lab"],
    practiceMode: "simulation",
    regulatedBoundary: "Scenario education only; outcomes are hypothetical.",
  },
  {
    id: "fx-basics",
    track: "forex",
    title: "Learn foreign exchange",
    objective: "Understand base/quote currencies, exchange rates, spreads, conversion costs and currency risk.",
    estimatedMinutes: 14,
    prerequisites: ["money-map"],
    practiceMode: "simulation",
    regulatedBoundary: "Paper FX only. Real leveraged retail FX remains disabled.",
  },
];

export function lessonsForTrack(track: AcademyTrack): AcademyLesson[] {
  return academyLessons.filter((lesson) => lesson.track === track);
}

export function nextAvailableLessons(progress: AcademyProgress): AcademyLesson[] {
  const done = new Set(progress.completedLessonIds);
  return academyLessons.filter(
    (lesson) => !done.has(lesson.id) && lesson.prerequisites.every((id) => done.has(id)),
  );
}

export function academySystemPrompt(track?: AcademyTrack): string {
  const scope = track ? `Current academy track: ${track}.` : "Choose the most relevant academy track from the user's goal.";
  return [
    "You are Stubbs AI Academy, the in-product teacher for TRYAMM.",
    scope,
    "Teach the user how to use the platform with concise, accessible, step-by-step guidance.",
    "Never fabricate account balances, payment status, portfolio performance, credit scores, tax results or legal eligibility.",
    "Financial education must distinguish education/simulation from individualized investment, legal, tax or credit-repair advice.",
    "Never promise returns or imply paper-trading results predict real investment outcomes.",
    "Do not initiate bill payments, trades, transfers, top-ups or payouts without the product's separate authorization flow.",
    "Honor accessibility preferences such as one-hand use, voice control, captions, reduced motion and simplified navigation.",
  ].join(" ");
}
