import type { SimFill, SimInstrument, PortfolioPosition } from "./simulator";

export type GlobalMarketRegion =
  | "us"
  | "canada"
  | "mexico"
  | "latin_america"
  | "caribbean"
  | "africa"
  | "europe"
  | "middle_east"
  | "india_south_asia"
  | "china_hong_kong"
  | "japan"
  | "korea"
  | "southeast_asia"
  | "oceania";

export interface GlobalMarketProfile {
  id: string;
  name: string;
  region: GlobalMarketRegion;
  timezone: string;
  currencies: string[];
  simulationEnabled: boolean;
  realExecutionEnabled: boolean;
  marketDataMode: "synthetic" | "delayed" | "licensed-live";
  executionProviderId?: string;
  custodyProviderId?: string;
  complianceApprovalId?: string;
}

export interface SimCashBalance {
  currency: string;
  amount: number;
}

export interface SimPortfolio {
  portfolioId: string;
  userId: string;
  cash: SimCashBalance[];
  positions: PortfolioPosition[];
  realizedPnl: number;
  educationalOnly: true;
}

export function assertMarketCanSimulate(profile: GlobalMarketProfile): void {
  if (!profile.simulationEnabled) throw new Error("simulation disabled for this market profile");
}

export function assertRealExecutionReady(profile: GlobalMarketProfile): void {
  if (!profile.realExecutionEnabled) throw new Error("real execution is locked for this market profile");
  if (!profile.executionProviderId || !profile.custodyProviderId || !profile.complianceApprovalId) {
    throw new Error("real execution requires approved execution, custody and compliance configuration");
  }
}

function getPosition(positions: PortfolioPosition[], symbol: string): PortfolioPosition | undefined {
  return positions.find((position) => position.symbol === symbol);
}

export function applySimulatedFill(
  portfolio: SimPortfolio,
  fill: SimFill,
  side: "buy" | "sell",
): SimPortfolio {
  const cashIndex = portfolio.cash.findIndex((entry) => entry.currency === fill.quoteCurrency);
  if (cashIndex < 0) throw new Error(`missing simulated cash balance for ${fill.quoteCurrency}`);

  const next: SimPortfolio = {
    ...portfolio,
    cash: portfolio.cash.map((entry) => ({ ...entry })),
    positions: portfolio.positions.map((position) => ({ ...position })),
  };

  const cash = next.cash[cashIndex];
  const position = getPosition(next.positions, fill.symbol);

  if (side === "buy") {
    if (cash.amount + 1e-9 < fill.notional) throw new Error("insufficient simulated cash");
    cash.amount = Number((cash.amount - fill.notional).toFixed(8));

    if (!position) {
      next.positions.push({
        symbol: fill.symbol,
        quantity: fill.quantity,
        averageCost: fill.price,
        quoteCurrency: fill.quoteCurrency,
      });
    } else {
      const oldCost = position.quantity * position.averageCost;
      const newCost = fill.quantity * fill.price;
      position.quantity = Number((position.quantity + fill.quantity).toFixed(8));
      position.averageCost = Number(((oldCost + newCost) / position.quantity).toFixed(8));
    }
    return next;
  }

  if (!position || position.quantity + 1e-9 < fill.quantity) {
    throw new Error("insufficient simulated position");
  }

  const realized = (fill.price - position.averageCost) * fill.quantity;
  next.realizedPnl = Number((next.realizedPnl + realized).toFixed(8));
  position.quantity = Number((position.quantity - fill.quantity).toFixed(8));
  cash.amount = Number((cash.amount + fill.notional).toFixed(8));
  if (Math.abs(position.quantity) < 1e-9) {
    next.positions = next.positions.filter((entry) => entry.symbol !== fill.symbol);
  }
  return next;
}

export interface StressShock {
  label: string;
  byAssetClass?: Partial<Record<SimInstrument["assetClass"], number>>;
  bySymbol?: Record<string, number>;
}

export interface StressResult {
  beforeValue: number;
  afterValue: number;
  change: number;
  changePct: number;
}

export function stressPortfolio(
  portfolio: SimPortfolio,
  instruments: Record<string, SimInstrument>,
  shock: StressShock,
): StressResult {
  let beforeValue = 0;
  let afterValue = 0;

  for (const position of portfolio.positions) {
    const instrument = instruments[position.symbol];
    if (!instrument) continue;
    const base = position.quantity * instrument.referencePrice;
    const shockPct = shock.bySymbol?.[position.symbol]
      ?? shock.byAssetClass?.[instrument.assetClass]
      ?? 0;
    beforeValue += base;
    afterValue += base * (1 + shockPct);
  }

  const change = afterValue - beforeValue;
  return {
    beforeValue: Number(beforeValue.toFixed(8)),
    afterValue: Number(afterValue.toFixed(8)),
    change: Number(change.toFixed(8)),
    changePct: beforeValue === 0 ? 0 : Number(((change / beforeValue) * 100).toFixed(4)),
  };
}

export const DEFAULT_GLOBAL_MARKETS: GlobalMarketProfile[] = [
  { id: "us", name: "United States", region: "us", timezone: "America/New_York", currencies: ["USD"], simulationEnabled: true, realExecutionEnabled: false, marketDataMode: "synthetic" },
  { id: "ca", name: "Canada", region: "canada", timezone: "America/Toronto", currencies: ["CAD", "USD"], simulationEnabled: true, realExecutionEnabled: false, marketDataMode: "synthetic" },
  { id: "mx", name: "Mexico", region: "mexico", timezone: "America/Mexico_City", currencies: ["MXN", "USD"], simulationEnabled: true, realExecutionEnabled: false, marketDataMode: "synthetic" },
  { id: "africa", name: "Africa", region: "africa", timezone: "Africa/Lagos", currencies: ["NGN", "ZAR", "GHS", "KES", "USD"], simulationEnabled: true, realExecutionEnabled: false, marketDataMode: "synthetic" },
  { id: "eu", name: "Europe", region: "europe", timezone: "Europe/London", currencies: ["EUR", "GBP", "CHF"], simulationEnabled: true, realExecutionEnabled: false, marketDataMode: "synthetic" },
  { id: "jp", name: "Japan", region: "japan", timezone: "Asia/Tokyo", currencies: ["JPY", "USD"], simulationEnabled: true, realExecutionEnabled: false, marketDataMode: "synthetic" },
  { id: "cn-hk", name: "China / Hong Kong", region: "china_hong_kong", timezone: "Asia/Hong_Kong", currencies: ["CNY", "HKD", "USD"], simulationEnabled: true, realExecutionEnabled: false, marketDataMode: "synthetic" },
  { id: "sea", name: "Southeast Asia", region: "southeast_asia", timezone: "Asia/Singapore", currencies: ["SGD", "IDR", "MYR", "THB", "PHP", "USD"], simulationEnabled: true, realExecutionEnabled: false, marketDataMode: "synthetic" },
];
