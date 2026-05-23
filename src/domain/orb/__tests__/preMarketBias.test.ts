import { describe, expect, it } from "vitest";
import type { PreMarketBiasEvaluation, PreMarketBiasInput, TradeSetup } from "../models";
import {
  evaluatePreMarketBias,
  evaluatePreMarketSetupAlignment,
} from "../preMarketBias";

const baseInput: PreMarketBiasInput = {
  bias: "bullish",
  isHigherTimeframeTrendAligned: true,
  isTradingWithTrend: true,
  marketCondition: "trending",
  keySupport: "100",
  keyResistance: "110",
  liquidityZoneNotes: "Prior day high at 108",
  hasMajorLevelsNearby: false,
  hasHighImpactNews: false,
  shouldAvoidTradingToday: false,
  confidenceScore: 4,
};

const validLongSetup: TradeSetup = {
  session: {
    symbol: "SPY",
    marketDate: "2026-05-22",
    high: 100,
    low: 95,
  },
  direction: "long",
  entryPrice: 101,
  stopPrice: 98,
  targetPrice: 108,
  confirmations: {
    brokeOpeningRange: true,
    heldRetest: true,
    volumeConfirmed: true,
    trendAligned: true,
    avoidedChop: true,
  },
};

const bullishBias: PreMarketBiasEvaluation = {
  biasSummary: "Bullish bias in a trending market, trend-aligned, confidence 4/5.",
  marketCondition: "trending",
  preferredDirection: "long",
  warnings: [],
  noTradeRecommendations: [],
};

describe("evaluatePreMarketBias", () => {
  it("prefers long direction for bullish trend alignment", () => {
    const evaluation = evaluatePreMarketBias(baseInput);

    expect(evaluation.preferredDirection).toBe("long");
    expect(evaluation.noTradeRecommendations).toHaveLength(0);
  });

  it("prefers short direction for bearish trend alignment", () => {
    const evaluation = evaluatePreMarketBias({
      ...baseInput,
      bias: "bearish",
    });

    expect(evaluation.preferredDirection).toBe("short");
  });

  it("avoids trading in neutral choppy conditions", () => {
    const evaluation = evaluatePreMarketBias({
      ...baseInput,
      bias: "neutral",
      marketCondition: "choppy",
    });

    expect(evaluation.preferredDirection).toBe("avoid-trading");
    expect(evaluation.noTradeRecommendations).toContain(
      "Market is choppy; avoid marginal ORB setups.",
    );
  });

  it("avoids trading when the avoid toggle is enabled", () => {
    const evaluation = evaluatePreMarketBias({
      ...baseInput,
      shouldAvoidTradingToday: true,
    });

    expect(evaluation.preferredDirection).toBe("avoid-trading");
    expect(evaluation.noTradeRecommendations).toContain(
      "Avoid trading today is enabled.",
    );
  });

  it("warns on high impact news days", () => {
    const evaluation = evaluatePreMarketBias({
      ...baseInput,
      hasHighImpactNews: true,
    });

    expect(evaluation.warnings).toContain(
      "High impact news is scheduled today.",
    );
  });
});

describe("evaluatePreMarketSetupAlignment", () => {
  it("returns no-trade reasons when bias says avoid trading", () => {
    const alignment = evaluatePreMarketSetupAlignment(validLongSetup, {
      ...bullishBias,
      preferredDirection: "avoid-trading",
    });

    expect(alignment.noTradeReasons).toContain(
      "Pre-market bias recommends avoiding trading.",
    );
  });

  it("does not warn when a long setup aligns with bullish bias", () => {
    const alignment = evaluatePreMarketSetupAlignment(
      validLongSetup,
      bullishBias,
    );

    expect(alignment.warnings).toHaveLength(0);
  });

  it("warns when a short setup conflicts with bullish bias", () => {
    const alignment = evaluatePreMarketSetupAlignment(
      { ...validLongSetup, direction: "short" },
      bullishBias,
    );

    expect(alignment.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "pre-market-direction-conflict" }),
      ]),
    );
  });

  it("warns when market condition is choppy", () => {
    const alignment = evaluatePreMarketSetupAlignment(validLongSetup, {
      ...bullishBias,
      marketCondition: "choppy",
    });

    expect(alignment.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "pre-market-market-condition" }),
      ]),
    );
  });

  it("allows missing pre-market bias context", () => {
    const alignment = evaluatePreMarketSetupAlignment(
      validLongSetup,
      undefined,
    );

    expect(alignment.noTradeReasons).toHaveLength(0);
    expect(alignment.warnings).toHaveLength(0);
  });
});
