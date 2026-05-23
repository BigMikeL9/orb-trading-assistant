import { describe, expect, it } from "vitest";
import type { JournalAnalyticsInput } from "../models";
import { calculateJournalAnalytics } from "../journalAnalytics";

function setup(
  journal: JournalAnalyticsInput["journal"],
): JournalAnalyticsInput {
  return { journal };
}

describe("calculateJournalAnalytics", () => {
  it("returns empty metrics when there are no saved setups", () => {
    expect(calculateJournalAnalytics([])).toEqual({
      totalSetups: 0,
      takenTrades: 0,
      skippedTrades: 0,
      wins: 0,
      losses: 0,
      breakeven: 0,
      winRate: null,
      averageRealizedR: null,
      mostCommonMistakeNote: null,
    });
  });

  it("handles only skipped setups", () => {
    expect(
      calculateJournalAnalytics([
        setup({ status: "skipped" }),
        setup({ status: "skipped", mistakeNotes: "Choppy open" }),
      ]),
    ).toEqual({
      totalSetups: 2,
      takenTrades: 0,
      skippedTrades: 2,
      wins: 0,
      losses: 0,
      breakeven: 0,
      winRate: null,
      averageRealizedR: null,
      mostCommonMistakeNote: "Choppy open",
    });
  });

  it("summarizes wins, losses, and breakeven trades", () => {
    const analytics = calculateJournalAnalytics([
      setup({ status: "win", realizedR: 2, mistakeNotes: "Late entry" }),
      setup({ status: "loss", realizedR: -1, mistakeNotes: "Late entry" }),
      setup({ status: "breakeven", realizedR: 0 }),
      setup({ status: "planned" }),
    ]);

    expect(analytics).toEqual({
      totalSetups: 4,
      takenTrades: 3,
      skippedTrades: 0,
      wins: 1,
      losses: 1,
      breakeven: 1,
      winRate: 1 / 3,
      averageRealizedR: 1 / 3,
      mostCommonMistakeNote: "Late entry",
    });
  });

  it("ignores missing realized R values when averaging", () => {
    const analytics = calculateJournalAnalytics([
      setup({ status: "win", realizedR: 3 }),
      setup({ status: "loss" }),
      setup({ status: "taken" }),
      setup({ status: "breakeven", realizedR: 0 }),
    ]);

    expect(analytics.averageRealizedR).toBe(1.5);
    expect(analytics.winRate).toBe(1 / 3);
  });
});
