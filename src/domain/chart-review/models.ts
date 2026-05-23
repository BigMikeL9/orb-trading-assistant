export type ChartTimeframe =
  | "15m-orb"
  | "5m-execution"
  | "1h-context"
  | "4h-context"
  | "daily";

export type ChartImage = {
  id: string;
  timeframe: ChartTimeframe;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  dataUrl: string;
  uploadedAt: string;
};

export type ChartSet = {
  id: string;
  symbol: string;
  marketDate: string;
  notes?: string;
  charts: ChartImage[];
  createdAt: string;
  updatedAt: string;
};

export type ChartSetValidation = {
  isValid: boolean;
  missingRequiredTimeframes: ChartTimeframe[];
  warnings: string[];
};

export type ChartPriceZone = {
  low: number;
  high: number;
};

export type ChartTrendBias = "bullish" | "bearish" | "neutral" | "unclear";

export type ChartMarketCondition =
  | "trending"
  | "choppy"
  | "range-bound"
  | "unclear";

export type ChartSetupVerdict = "valid" | "no-trade" | "wait";

export type ChartSetupDirection = "long" | "short" | "none";

export type ChartBreakoutStatus =
  | "not-broken"
  | "breaking"
  | "broken"
  | "failed-breakout"
  | "unclear";

export type ChartRetestStatus =
  | "not-tested"
  | "testing"
  | "held"
  | "failed"
  | "unclear";

export type ChartConfidenceLevel = "low" | "medium" | "high" | "unclear";

export type ExtractedChartContext = {
  symbol: string | null;
  marketDate: string | null;
  timeframesReviewed: ChartTimeframe[];
  orbHigh: number | null;
  orbLow: number | null;
  currentPrice: number | null;
  higherTimeframeBias: ChartTrendBias;
  marketCondition: ChartMarketCondition;
  keySupportZones: ChartPriceZone[];
  keyResistanceZones: ChartPriceZone[];
  liquidityAoiNotes: string[];
};

export type ChartRuleExplanation = {
  ruleId: string;
  label: string;
  explanation: string;
};

export type CurrentChartSetupEvaluation = {
  verdict: ChartSetupVerdict;
  direction: ChartSetupDirection;
  breakoutStatus: ChartBreakoutStatus;
  retestStatus: ChartRetestStatus;
  noTradeReasons: string[];
  warnings: string[];
  confidenceLevel: ChartConfidenceLevel;
  ruleExplanations: ChartRuleExplanation[];
};

export type IdealChartTradeScenario = {
  entryZone: ChartPriceZone | null;
  stop: number | null;
  targets: number[];
  invalidation: string[];
  confirmationNeeded: string[];
};

export type IdealChartTradeGuidance = {
  idealLongScenario: IdealChartTradeScenario | null;
  idealShortScenario: IdealChartTradeScenario | null;
};

export type ChartAnalysisResult = {
  extractedContext: ExtractedChartContext;
  currentSetupEvaluation: CurrentChartSetupEvaluation;
  idealTradeGuidance: IdealChartTradeGuidance;
};
