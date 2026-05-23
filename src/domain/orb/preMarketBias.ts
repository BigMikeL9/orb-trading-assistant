import type {
  PreMarketBiasEvaluation,
  PreMarketBiasInput,
  PreMarketSetupAlignment,
  PreferredDirection,
  RuleResult,
  TradeSetup,
} from "./models";

function ruleResult(
  id: string,
  label: string,
  status: RuleResult["status"],
  message: string,
): RuleResult {
  return { id, label, status, message };
}

function getPreferredDirection(input: PreMarketBiasInput): PreferredDirection {
  if (input.shouldAvoidTradingToday) {
    return "avoid-trading";
  }

  if (
    input.marketCondition === "choppy" ||
    input.marketCondition === "unclear" ||
    input.confidenceScore <= 2
  ) {
    return "avoid-trading";
  }

  if (input.bias === "neutral" || input.marketCondition === "range-bound") {
    return "both";
  }

  if (!input.isHigherTimeframeTrendAligned || !input.isTradingWithTrend) {
    return "both";
  }

  return input.bias === "bullish" ? "long" : "short";
}

function formatBiasSummary(input: PreMarketBiasInput) {
  const biasLabel = input.bias[0]?.toUpperCase() + input.bias.slice(1);
  const conditionLabel = input.marketCondition;
  const trendContext =
    input.isHigherTimeframeTrendAligned && input.isTradingWithTrend
      ? "trend-aligned"
      : "not fully trend-aligned";

  return `${biasLabel} bias in a ${conditionLabel} market, ${trendContext}, confidence ${input.confidenceScore}/5.`;
}

export function evaluatePreMarketBias(
  input: PreMarketBiasInput,
): PreMarketBiasEvaluation {
  const warnings: string[] = [];
  const noTradeRecommendations: string[] = [];
  const preferredDirection = getPreferredDirection(input);

  if (input.hasHighImpactNews) {
    warnings.push("High impact news is scheduled today.");
  }

  if (input.hasMajorLevelsNearby) {
    warnings.push("Major levels are nearby; expect reactions or failed breaks.");
  }

  if (!input.isHigherTimeframeTrendAligned) {
    warnings.push("Higher timeframe trend is not aligned.");
  }

  if (!input.isTradingWithTrend) {
    warnings.push("Planned trades are not with the trend.");
  }

  if (input.marketCondition === "choppy") {
    noTradeRecommendations.push("Market is choppy; avoid marginal ORB setups.");
  }

  if (input.marketCondition === "unclear") {
    noTradeRecommendations.push("Market condition is unclear; wait for clarity.");
  }

  if (input.shouldAvoidTradingToday) {
    noTradeRecommendations.push("Avoid trading today is enabled.");
  }

  if (input.confidenceScore <= 2) {
    noTradeRecommendations.push("Confidence score is too low for execution.");
  }

  return {
    biasSummary: formatBiasSummary(input),
    marketCondition: input.marketCondition,
    preferredDirection,
    warnings,
    noTradeRecommendations,
  };
}

export function evaluatePreMarketSetupAlignment(
  setup: TradeSetup,
  preMarketBias: PreMarketBiasEvaluation | undefined,
): PreMarketSetupAlignment {
  const warnings: RuleResult[] = [];
  const noTradeReasons: string[] = [];

  if (preMarketBias === undefined) {
    return { warnings, noTradeReasons };
  }

  if (preMarketBias.preferredDirection === "avoid-trading") {
    noTradeReasons.push("Pre-market bias recommends avoiding trading.");
  }

  if (
    preMarketBias.preferredDirection === "long" &&
    setup.direction === "short"
  ) {
    warnings.push(
      ruleResult(
        "pre-market-direction-conflict",
        "Pre-market direction conflict",
        "warning",
        "Pre-market bias prefers long setups, but this setup is short.",
      ),
    );
  }

  if (
    preMarketBias.preferredDirection === "short" &&
    setup.direction === "long"
  ) {
    warnings.push(
      ruleResult(
        "pre-market-direction-conflict",
        "Pre-market direction conflict",
        "warning",
        "Pre-market bias prefers short setups, but this setup is long.",
      ),
    );
  }

  if (preMarketBias.marketCondition !== "trending") {
    warnings.push(
      ruleResult(
        "pre-market-market-condition",
        "Pre-market market condition",
        "warning",
        `Pre-market market condition is ${preMarketBias.marketCondition}.`,
      ),
    );
  }

  return { warnings, noTradeReasons };
}
