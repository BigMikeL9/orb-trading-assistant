import type {
  DailyRiskGuardrailsEvaluation,
  DailyRiskTradeInput,
  RiskSettings,
  TradeJournalStatus,
} from "./models";

export const defaultRiskSettings: RiskSettings = {
  maxTradesPerDay: 3,
  maxDailyLossR: 2,
  maxConsecutiveLosses: 2,
  minimumRequiredRiskReward: 2,
};

const takenStatuses = new Set<TradeJournalStatus>([
  "taken",
  "win",
  "loss",
  "breakeven",
]);

function isTakenTrade(trade: DailyRiskTradeInput) {
  return takenStatuses.has(trade.journal.status);
}

function sortNewestFirst(trades: DailyRiskTradeInput[]) {
  return [...trades].sort(
    (left, right) =>
      new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime(),
  );
}

function calculateConsecutiveLosses(trades: DailyRiskTradeInput[]) {
  let consecutiveLosses = 0;

  for (const trade of sortNewestFirst(trades)) {
    if (trade.journal.status === "loss") {
      consecutiveLosses += 1;
      continue;
    }

    if (isTakenTrade(trade)) {
      break;
    }
  }

  return consecutiveLosses;
}

export function evaluateDailyRiskGuardrails(
  trades: DailyRiskTradeInput[],
  marketDate: string,
  settings: RiskSettings = defaultRiskSettings,
): DailyRiskGuardrailsEvaluation {
  const tradesForDate = trades.filter((trade) => trade.marketDate === marketDate);
  const takenTradesForDate = tradesForDate.filter(isTakenTrade);
  const tradesTakenToday = takenTradesForDate.length;
  const totalRealizedRToday = takenTradesForDate.reduce(
    (total, trade) =>
      Number.isFinite(trade.journal.realizedR)
        ? total + (trade.journal.realizedR ?? 0)
        : total,
    0,
  );
  const consecutiveLosses = calculateConsecutiveLosses(tradesForDate);
  const noTradeReasons: string[] = [];

  if (tradesTakenToday >= settings.maxTradesPerDay) {
    noTradeReasons.push("Max trades per day reached.");
  }

  if (totalRealizedRToday <= -settings.maxDailyLossR) {
    noTradeReasons.push("Max daily loss reached.");
  }

  if (consecutiveLosses >= settings.maxConsecutiveLosses) {
    noTradeReasons.push("Max consecutive losses reached.");
  }

  return {
    marketDate,
    tradesTakenToday,
    totalRealizedRToday,
    consecutiveLosses,
    isTradingAllowed: noTradeReasons.length === 0,
    noTradeReasons,
  };
}
