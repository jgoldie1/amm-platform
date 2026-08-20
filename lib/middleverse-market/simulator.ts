export type SimAssetClass = "stock" | "etf" | "forex" | "creator_index" | "sector_index";

export interface SimInstrument {
  symbol: string;
  name: string;
  assetClass: SimAssetClass;
  quoteCurrency: string;
  referencePrice: number;
  fractional: boolean;
  minFraction?: number;
  constituents?: Array<{ symbol: string; weight: number }>;
  educationalOnly: true;
}

export interface SimOrder {
  orderId: string;
  userId: string;
  symbol: string;
  side: "buy" | "sell";
  orderType: "market" | "limit";
  quantity: number;
  limitPrice?: number;
  submittedAt: string;
}

export interface SimFill {
  orderId: string;
  symbol: string;
  quantity: number;
  price: number;
  notional: number;
  quoteCurrency: string;
  simulated: true;
  filledAt: string;
}

export interface FxPair {
  base: string;
  quote: string;
  referenceRate: number;
  source: "simulation" | "licensed-market-data";
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  averageCost: number;
  quoteCurrency: string;
}

export function validateWeights(instrument: SimInstrument): boolean {
  if (!instrument.constituents?.length) return true;
  const sum = instrument.constituents.reduce((n, item) => n + item.weight, 0);
  return Math.abs(sum - 1) < 1e-9 && instrument.constituents.every((x) => x.weight >= 0 && x.weight <= 1);
}

export function fillSimulatedOrder(order: SimOrder, instrument: SimInstrument): SimFill {
  if (instrument.symbol !== order.symbol) throw new Error("instrument mismatch");
  if (!Number.isFinite(order.quantity) || order.quantity <= 0) throw new Error("quantity must be positive");
  if (!instrument.fractional && !Number.isInteger(order.quantity)) throw new Error("instrument requires whole shares");
  if (instrument.minFraction && order.quantity < instrument.minFraction) throw new Error("quantity is below minimum fraction");
  if (order.orderType === "limit" && (!order.limitPrice || order.limitPrice <= 0)) throw new Error("valid limit price required");

  const marketPrice = instrument.referencePrice;
  if (order.orderType === "limit") {
    const crosses = order.side === "buy" ? marketPrice <= order.limitPrice! : marketPrice >= order.limitPrice!;
    if (!crosses) throw new Error("simulated limit order is not marketable");
  }

  return {
    orderId: order.orderId,
    symbol: order.symbol,
    quantity: order.quantity,
    price: marketPrice,
    notional: Number((marketPrice * order.quantity).toFixed(8)),
    quoteCurrency: instrument.quoteCurrency,
    simulated: true,
    filledAt: new Date().toISOString(),
  };
}

export function convertSimulatedFx(amount: number, pair: FxPair): number {
  if (!Number.isFinite(amount) || amount < 0) throw new Error("invalid amount");
  if (!Number.isFinite(pair.referenceRate) || pair.referenceRate <= 0) throw new Error("invalid FX reference rate");
  return Number((amount * pair.referenceRate).toFixed(8));
}

/**
 * Creates an educational ETF/index-like basket. This is not a registered ETF,
 * security, investment company, or public offering. Live regulated products
 * require separate legal approval and licensed partners/venues.
 */
export function createSimulatedBasket(
  symbol: string,
  name: string,
  constituents: Array<{ symbol: string; weight: number }>,
  referencePrice = 100,
): SimInstrument {
  const instrument: SimInstrument = {
    symbol,
    name,
    assetClass: "etf",
    quoteCurrency: "USD",
    referencePrice,
    fractional: true,
    minFraction: 0.0001,
    constituents,
    educationalOnly: true,
  };
  if (!validateWeights(instrument)) throw new Error("basket weights must be non-negative and sum to 1");
  return instrument;
}

export const MIDDLEVERSE_MARKET_CAPABILITIES = Object.freeze({
  paperStocks: true,
  paperETFs: true,
  fractionalPaperShares: true,
  paperForex: true,
  simulatedCreatorIndexes: true,
  simulatedSectorIndexes: true,
  realSecuritiesExecution: false,
  realLeveragedForex: false,
  cryptoExecution: false,
});
