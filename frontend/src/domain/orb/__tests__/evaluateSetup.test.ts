import { describe, expect, it } from "vitest";
import type { PreMarketBiasEvaluation, TradeSetup } from "../models";
import { evaluateSetup } from "../evaluateSetup";

const confirmed = {
  brokeOpeningRange: true,
  heldRetest: true,
  volumeConfirmed: true,
  trendAligned: true,
  avoidedChop: true,
};

const validLongSetup: TradeSetup = {
  session: {
    symbol: "AAPL",
    marketDate: "2026-05-22",
    high: 100,
    low: 95,
  },
  direction: "long",
  entryPrice: 101,
  stopPrice: 98,
  targetPrice: 108,
  confirmations: confirmed,
};

const bullishPreMarketBias: PreMarketBiasEvaluation = {
  biasSummary: "Bullish bias in a trending market, trend-aligned, confidence 4/5.",
  marketCondition: "trending",
  preferredDirection: "long",
  warnings: [],
  noTradeRecommendations: [],
};

describe("evaluateSetup", () => {
  it("returns a valid verdict for a valid long setup", () => {
    const evaluation = evaluateSetup(validLongSetup);

    expect(evaluation.verdict).toBe("valid");
    expect(evaluation.failedRules).toHaveLength(0);
    expect(evaluation.warnings).toHaveLength(0);
    expect(evaluation.riskReward.ratio).toBeCloseTo(2.3333);
  });

  it("returns a valid verdict for a valid short setup", () => {
    const evaluation = evaluateSetup({
      ...validLongSetup,
      direction: "short",
      entryPrice: 94,
      stopPrice: 97,
      targetPrice: 87,
    });

    expect(evaluation.verdict).toBe("valid");
    expect(evaluation.failedRules).toHaveLength(0);
    expect(evaluation.riskReward.ratio).toBeCloseTo(2.3333);
  });

  it("returns no-trade when entry is inside the opening range", () => {
    const evaluation = evaluateSetup({
      ...validLongSetup,
      entryPrice: 98,
      stopPrice: 96,
      targetPrice: 104,
    });

    expect(evaluation.verdict).toBe("no-trade");
    expect(evaluation.noTradeReasons).toContain(
      "Entry is inside the opening range.",
    );
  });

  it("warns when risk/reward is below the minimum threshold", () => {
    const evaluation = evaluateSetup({
      ...validLongSetup,
      entryPrice: 101,
      stopPrice: 98,
      targetPrice: 105,
    });

    expect(evaluation.verdict).toBe("valid");
    expect(evaluation.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "minimum-risk-reward" }),
      ]),
    );
  });

  it("fails rules when confirmations are missing", () => {
    const evaluation = evaluateSetup({
      ...validLongSetup,
      confirmations: {
        ...confirmed,
        volumeConfirmed: false,
        trendAligned: false,
      },
    });

    expect(evaluation.verdict).toBe("invalid");
    expect(evaluation.failedRules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "confirmation-volumeConfirmed" }),
        expect.objectContaining({ id: "confirmation-trendAligned" }),
      ]),
    );
  });

  it("returns no-trade when pre-market bias says avoid trading", () => {
    const evaluation = evaluateSetup(validLongSetup, {
      preMarketBias: {
        ...bullishPreMarketBias,
        preferredDirection: "avoid-trading",
        noTradeRecommendations: ["Avoid trading today is enabled."],
      },
    });

    expect(evaluation.verdict).toBe("no-trade");
    expect(evaluation.noTradeReasons).toContain(
      "Pre-market bias recommends avoiding trading.",
    );
  });

  it("does not warn when a long setup aligns with bullish bias", () => {
    const evaluation = evaluateSetup(validLongSetup, {
      preMarketBias: bullishPreMarketBias,
    });

    expect(evaluation.verdict).toBe("valid");
    expect(evaluation.warnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "pre-market-direction-conflict" }),
      ]),
    );
  });

  it("warns when a short setup conflicts with bullish bias", () => {
    const evaluation = evaluateSetup(
      {
        ...validLongSetup,
        direction: "short",
        entryPrice: 94,
        stopPrice: 97,
        targetPrice: 87,
      },
      { preMarketBias: bullishPreMarketBias },
    );

    expect(evaluation.verdict).toBe("valid");
    expect(evaluation.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "pre-market-direction-conflict" }),
      ]),
    );
  });

  it("warns when pre-market market condition is choppy", () => {
    const evaluation = evaluateSetup(validLongSetup, {
      preMarketBias: {
        ...bullishPreMarketBias,
        marketCondition: "choppy",
      },
    });

    expect(evaluation.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "pre-market-market-condition" }),
      ]),
    );
  });

  it("does not require pre-market bias context", () => {
    const evaluation = evaluateSetup(validLongSetup);

    expect(evaluation.verdict).toBe("valid");
  });
});
