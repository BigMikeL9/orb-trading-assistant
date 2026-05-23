import type { PreMarketBiasInput } from "@/domain/orb/models";
import type {
  PreMarketBiasDraft,
  PreMarketBiasStorage,
  PreMarketBiasStorageResult,
} from "./preMarketBiasStorage.types";

const STORAGE_KEY = "orb-trading-assistant:pre-market-bias";

export const defaultPreMarketBiasDraft: PreMarketBiasDraft = {
  bias: "neutral",
  isHigherTimeframeTrendAligned: false,
  isTradingWithTrend: false,
  marketCondition: "unclear",
  keySupport: "",
  keyResistance: "",
  liquidityZoneNotes: "",
  hasMajorLevelsNearby: false,
  hasHighImpactNews: false,
  shouldAvoidTradingToday: false,
  confidenceScore: "3",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeDraft(value: unknown): PreMarketBiasDraft {
  if (!isRecord(value)) {
    return defaultPreMarketBiasDraft;
  }

  return {
    ...defaultPreMarketBiasDraft,
    ...value,
    confidenceScore:
      typeof value.confidenceScore === "string"
        ? value.confidenceScore
        : defaultPreMarketBiasDraft.confidenceScore,
  };
}

export function getPreMarketBiasDraft(
  storage: PreMarketBiasStorage,
): PreMarketBiasStorageResult {
  try {
    const rawValue = storage.getItem(STORAGE_KEY);

    if (rawValue === null) {
      return {
        draft: defaultPreMarketBiasDraft,
        errorMessage: null,
      };
    }

    return {
      draft: normalizeDraft(JSON.parse(rawValue)),
      errorMessage: null,
    };
  } catch {
    return {
      draft: defaultPreMarketBiasDraft,
      errorMessage: "Pre-market bias could not be loaded.",
    };
  }
}

export function savePreMarketBiasDraft(
  storage: PreMarketBiasStorage,
  draft: PreMarketBiasDraft,
) {
  storage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function toPreMarketBiasInput(
  draft: PreMarketBiasDraft,
): PreMarketBiasInput {
  const confidenceScore = Number(draft.confidenceScore);

  return {
    ...draft,
    confidenceScore:
      Number.isFinite(confidenceScore) && confidenceScore >= 1
        ? Math.min(confidenceScore, 5)
        : 1,
  };
}
