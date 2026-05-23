export type TradeDirection = "long" | "short";

export type OpeningRangeSession = {
  symbol: string;
  marketDate: string;
  high: number;
  low: number;
};

export type SetupConfirmations = {
  brokeOpeningRange: boolean;
  heldRetest: boolean;
  volumeConfirmed: boolean;
  trendAligned: boolean;
  avoidedChop: boolean;
};

export type TradeSetup = RiskRewardInput & {
  session: OpeningRangeSession;
  confirmations: SetupConfirmations;
};

export type RuleStatus = "pass" | "fail" | "warning";

export type RuleResult = {
  id: string;
  label: string;
  status: RuleStatus;
  message: string;
};

export type SetupVerdict = "valid" | "invalid" | "no-trade";

export type SetupEvaluation = {
  verdict: SetupVerdict;
  passedRules: RuleResult[];
  failedRules: RuleResult[];
  warnings: RuleResult[];
  noTradeReasons: string[];
  riskReward: RiskRewardResult;
};

export type TradeJournalStatus =
  | "planned"
  | "taken"
  | "skipped"
  | "win"
  | "loss"
  | "breakeven";

export type TradeJournal = {
  status: TradeJournalStatus;
  actualEntry?: number;
  actualExit?: number;
  realizedR?: number;
  mistakeNotes?: string;
  lessonLearned?: string;
};

export type JournalAnalyticsInput = {
  journal: TradeJournal;
};

export type JournalAnalyticsSummary = {
  totalSetups: number;
  takenTrades: number;
  skippedTrades: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRate: number | null;
  averageRealizedR: number | null;
  mostCommonMistakeNote: string | null;
};

export type RiskSettings = {
  maxTradesPerDay: number;
  maxDailyLossR: number;
  maxConsecutiveLosses: number;
  minimumRequiredRiskReward: number;
};

export type SetupEvaluationOptions = {
  minimumRequiredRiskReward?: number;
  preMarketBias?: PreMarketBiasEvaluation;
};

export type DailyRiskTradeInput = {
  savedAt: string;
  marketDate: string;
  journal: TradeJournal;
};

export type DailyRiskGuardrailsEvaluation = {
  marketDate: string;
  tradesTakenToday: number;
  totalRealizedRToday: number;
  consecutiveLosses: number;
  isTradingAllowed: boolean;
  noTradeReasons: string[];
};

export type MarketBias = "bullish" | "bearish" | "neutral";

export type MarketCondition = "trending" | "choppy" | "range-bound" | "unclear";

export type PreferredDirection = "long" | "short" | "both" | "avoid-trading";

export type PreMarketBiasInput = {
  bias: MarketBias;
  isHigherTimeframeTrendAligned: boolean;
  isTradingWithTrend: boolean;
  marketCondition: MarketCondition;
  keySupport: string;
  keyResistance: string;
  liquidityZoneNotes: string;
  hasMajorLevelsNearby: boolean;
  hasHighImpactNews: boolean;
  shouldAvoidTradingToday: boolean;
  confidenceScore: number;
};

export type PreMarketBiasEvaluation = {
  biasSummary: string;
  marketCondition: MarketCondition;
  preferredDirection: PreferredDirection;
  warnings: string[];
  noTradeRecommendations: string[];
};

export type PreMarketSetupAlignment = {
  warnings: RuleResult[];
  noTradeReasons: string[];
};

export type RiskRewardInput = {
  direction: TradeDirection;
  entryPrice: number;
  stopPrice: number;
  targetPrice: number;
};

export type RiskRewardResult = {
  riskPerShare: number;
  rewardPerShare: number;
  ratio: number | null;
  isValid: boolean;
};
