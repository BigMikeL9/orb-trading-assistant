import type {
  JournalAnalyticsInput,
  JournalAnalyticsSummary,
  TradeJournalStatus,
} from "./models";

const takenStatuses = new Set<TradeJournalStatus>([
  "taken",
  "win",
  "loss",
  "breakeven",
]);

const outcomeStatuses = new Set<TradeJournalStatus>([
  "win",
  "loss",
  "breakeven",
]);

function getMostCommonMistakeNote(setups: JournalAnalyticsInput[]) {
  const mistakeCounts = new Map<string, number>();

  for (const setup of setups) {
    const mistakeNote = setup.journal.mistakeNotes?.trim();

    if (mistakeNote === undefined || mistakeNote === "") {
      continue;
    }

    mistakeCounts.set(mistakeNote, (mistakeCounts.get(mistakeNote) ?? 0) + 1);
  }

  let mostCommonMistakeNote: string | null = null;
  let highestCount = 0;

  for (const [mistakeNote, count] of mistakeCounts) {
    if (count > highestCount) {
      mostCommonMistakeNote = mistakeNote;
      highestCount = count;
    }
  }

  return mostCommonMistakeNote;
}

export function calculateJournalAnalytics(
  setups: JournalAnalyticsInput[],
): JournalAnalyticsSummary {
  const totalSetups = setups.length;
  const takenTrades = setups.filter((setup) =>
    takenStatuses.has(setup.journal.status),
  ).length;
  const skippedTrades = setups.filter(
    (setup) => setup.journal.status === "skipped",
  ).length;
  const wins = setups.filter((setup) => setup.journal.status === "win").length;
  const losses = setups.filter((setup) => setup.journal.status === "loss").length;
  const breakeven = setups.filter(
    (setup) => setup.journal.status === "breakeven",
  ).length;
  const completedTrades = setups.filter((setup) =>
    outcomeStatuses.has(setup.journal.status),
  ).length;
  const realizedRValues = setups
    .map((setup) => setup.journal.realizedR)
    .filter((realizedR): realizedR is number => Number.isFinite(realizedR));

  return {
    totalSetups,
    takenTrades,
    skippedTrades,
    wins,
    losses,
    breakeven,
    winRate: completedTrades === 0 ? null : wins / completedTrades,
    averageRealizedR:
      realizedRValues.length === 0
        ? null
        : realizedRValues.reduce((sum, realizedR) => sum + realizedR, 0) /
          realizedRValues.length,
    mostCommonMistakeNote: getMostCommonMistakeNote(setups),
  };
}
