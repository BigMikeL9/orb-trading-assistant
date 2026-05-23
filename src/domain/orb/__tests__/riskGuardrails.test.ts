import { describe, expect, it } from "vitest";
import type { DailyRiskTradeInput, RiskSettings, TradeSetup } from "../models";
import { evaluateSetup } from "../evaluateSetup";
import {
  defaultRiskSettings,
  evaluateDailyRiskGuardrails,
} from "../riskGuardrails";

const settings: RiskSettings = {
  maxTradesPerDay: 2,
  maxDailyLossR: 2,
  maxConsecutiveLosses: 2,
  minimumRequiredRiskReward: 2.5,
};

function trade(
  status: DailyRiskTradeInput["journal"]["status"],
  savedAt: string,
  realizedR?: number,
): DailyRiskTradeInput {
  return {
    savedAt,
    marketDate: "2026-05-22",
    journal: {
      status,
      realizedR,
    },
  };
}

describe("evaluateDailyRiskGuardrails", () => {
  it("blocks trading when max trades are reached", () => {
    const evaluation = evaluateDailyRiskGuardrails(
      [
        trade("win", "2026-05-22T14:00:00.000Z", 1),
        trade("loss", "2026-05-22T15:00:00.000Z", -1),
      ],
      "2026-05-22",
      settings,
    );

    expect(evaluation.tradesTakenToday).toBe(2);
    expect(evaluation.isTradingAllowed).toBe(false);
    expect(evaluation.noTradeReasons).toContain("Max trades per day reached.");
  });

  it("blocks trading when max daily loss is reached", () => {
    const evaluation = evaluateDailyRiskGuardrails(
      [trade("loss", "2026-05-22T14:00:00.000Z", -2)],
      "2026-05-22",
      settings,
    );

    expect(evaluation.totalRealizedRToday).toBe(-2);
    expect(evaluation.isTradingAllowed).toBe(false);
    expect(evaluation.noTradeReasons).toContain("Max daily loss reached.");
  });

  it("blocks trading when max consecutive losses are reached", () => {
    const evaluation = evaluateDailyRiskGuardrails(
      [
        trade("loss", "2026-05-22T15:00:00.000Z", -1),
        trade("loss", "2026-05-22T16:00:00.000Z", -1),
      ],
      "2026-05-22",
      { ...settings, maxTradesPerDay: 5, maxDailyLossR: 5 },
    );

    expect(evaluation.consecutiveLosses).toBe(2);
    expect(evaluation.isTradingAllowed).toBe(false);
    expect(evaluation.noTradeReasons).toContain(
      "Max consecutive losses reached.",
    );
  });

  it("allows trading when under limits", () => {
    const evaluation = evaluateDailyRiskGuardrails(
      [trade("win", "2026-05-22T14:00:00.000Z", 1)],
      "2026-05-22",
      settings,
    );

    expect(evaluation).toEqual({
      marketDate: "2026-05-22",
      tradesTakenToday: 1,
      totalRealizedRToday: 1,
      consecutiveLosses: 0,
      isTradingAllowed: true,
      noTradeReasons: [],
    });
  });
});

describe("minimum risk/reward setting", () => {
  const setup: TradeSetup = {
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

  it("uses the configured minimum R/R threshold", () => {
    const evaluation = evaluateSetup(setup, {
      minimumRequiredRiskReward: settings.minimumRequiredRiskReward,
    });

    expect(evaluation.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "minimum-risk-reward" }),
      ]),
    );
  });

  it("uses the default minimum R/R threshold when not configured", () => {
    const evaluation = evaluateSetup(setup, {
      minimumRequiredRiskReward: defaultRiskSettings.minimumRequiredRiskReward,
    });

    expect(evaluation.warnings).toHaveLength(0);
  });
});
