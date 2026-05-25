import type {
  RuleResult,
  SetupConfirmations,
  SetupEvaluation,
  SetupEvaluationOptions,
  TradeSetup,
} from "./models";
import { evaluatePreMarketSetupAlignment } from "./preMarketBias";
import { calculateRiskReward } from "./riskReward";

const DEFAULT_MINIMUM_RISK_REWARD_RATIO = 2;

const confirmationLabels: Record<keyof SetupConfirmations, string> = {
  brokeOpeningRange: "Broke opening range",
  heldRetest: "Held retest",
  volumeConfirmed: "Volume confirmed",
  trendAligned: "Trend aligned",
  avoidedChop: "Avoided chop",
};

function ruleResult(
  id: string,
  label: string,
  status: RuleResult["status"],
  message: string,
): RuleResult {
  return { id, label, status, message };
}

function isEntryOutsideRange(setup: TradeSetup) {
  const { direction, entryPrice, session } = setup;
  return direction === "long"
    ? entryPrice > session.high
    : entryPrice < session.low;
}

function evaluateConfirmationRules(setup: TradeSetup): RuleResult[] {
  return Object.entries(setup.confirmations).map(([key, isConfirmed]) => {
    const confirmationKey = key as keyof SetupConfirmations;
    const label = confirmationLabels[confirmationKey];

    return ruleResult(
      `confirmation-${confirmationKey}`,
      label,
      isConfirmed ? "pass" : "fail",
      isConfirmed
        ? `${label} is confirmed.`
        : `${label} is missing from the setup.`,
    );
  });
}

export function evaluateSetup(
  setup: TradeSetup,
  options: SetupEvaluationOptions = {},
): SetupEvaluation {
  const rules: RuleResult[] = [];
  const warnings: RuleResult[] = [];
  const noTradeReasons: string[] = [];
  const riskReward = calculateRiskReward(setup);
  const minimumRiskRewardRatio =
    options.minimumRequiredRiskReward ?? DEFAULT_MINIMUM_RISK_REWARD_RATIO;
  const preMarketContext = evaluatePreMarketSetupAlignment(
    setup,
    options.preMarketBias,
  );
  warnings.push(...preMarketContext.warnings);
  noTradeReasons.push(...preMarketContext.noTradeReasons);

  const hasValidOpeningRange =
    Number.isFinite(setup.session.high) &&
    Number.isFinite(setup.session.low) &&
    setup.session.high > setup.session.low;

  rules.push(
    ruleResult(
      "opening-range-valid",
      "Opening range is valid",
      hasValidOpeningRange ? "pass" : "fail",
      hasValidOpeningRange
        ? "Opening range high is above opening range low."
        : "Opening range high must be above opening range low.",
    ),
  );

  const entryOutsideRange = hasValidOpeningRange && isEntryOutsideRange(setup);

  rules.push(
    ruleResult(
      "entry-outside-range",
      "Entry is outside opening range",
      entryOutsideRange ? "pass" : "fail",
      entryOutsideRange
        ? "Entry is beyond the opening range in the trade direction."
        : "Entry must be beyond the opening range before considering a trade.",
    ),
  );

  if (hasValidOpeningRange && !entryOutsideRange) {
    noTradeReasons.push("Entry is inside the opening range.");
  }

  rules.push(
    ruleResult(
      "risk-reward-valid",
      "Risk/reward uses valid prices",
      riskReward.isValid ? "pass" : "fail",
      riskReward.isValid
        ? "Entry, stop, and target create positive risk and reward."
        : "Entry, stop, and target must create positive risk and reward.",
    ),
  );

  if (riskReward.isValid && riskReward.ratio !== null) {
    warnings.push(
      ruleResult(
        "minimum-risk-reward",
        "Minimum risk/reward",
        riskReward.ratio >= minimumRiskRewardRatio ? "pass" : "warning",
        riskReward.ratio >= minimumRiskRewardRatio
          ? `Risk/reward meets the minimum ${minimumRiskRewardRatio}R threshold.`
          : `Risk/reward is below the minimum ${minimumRiskRewardRatio}R threshold.`,
      ),
    );
  }

  rules.push(...evaluateConfirmationRules(setup));

  const passedRules = rules.filter((rule) => rule.status === "pass");
  const failedRules = rules.filter((rule) => rule.status === "fail");
  const activeWarnings = warnings.filter((rule) => rule.status === "warning");

  const verdict =
    noTradeReasons.length > 0
      ? "no-trade"
      : failedRules.length > 0
        ? "invalid"
        : "valid";

  return {
    verdict,
    passedRules,
    failedRules,
    warnings: activeWarnings,
    noTradeReasons,
    riskReward,
  };
}
