import type { ChartAnalysisResult } from "./models";

export function createEmptyChartAnalysisResult(): ChartAnalysisResult {
  return {
    extractedContext: {
      symbol: null,
      marketDate: null,
      timeframesReviewed: [],
      orbHigh: null,
      orbLow: null,
      currentPrice: null,
      higherTimeframeBias: "unclear",
      marketCondition: "unclear",
      keySupportZones: [],
      keyResistanceZones: [],
      liquidityAoiNotes: [],
    },
    currentSetupEvaluation: {
      verdict: "wait",
      direction: "none",
      breakoutStatus: "unclear",
      retestStatus: "unclear",
      noTradeReasons: [],
      warnings: [],
      confidenceLevel: "unclear",
      ruleExplanations: [],
    },
    idealTradeGuidance: {
      idealLongScenario: null,
      idealShortScenario: null,
    },
  };
}
