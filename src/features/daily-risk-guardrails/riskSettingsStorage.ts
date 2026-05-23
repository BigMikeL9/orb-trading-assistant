import { defaultRiskSettings } from "@/domain/orb/riskGuardrails";
import type { RiskSettings } from "@/domain/orb/models";
import type {
  RiskSettingsStorage,
  RiskSettingsStorageResult,
} from "./riskSettingsStorage.types";

const STORAGE_KEY = "orb-trading-assistant:risk-settings";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toPositiveNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

function normalizeRiskSettings(value: unknown): RiskSettings {
  if (!isRecord(value)) {
    return defaultRiskSettings;
  }

  return {
    maxTradesPerDay: toPositiveNumber(
      value.maxTradesPerDay,
      defaultRiskSettings.maxTradesPerDay,
    ),
    maxDailyLossR: toPositiveNumber(
      value.maxDailyLossR,
      defaultRiskSettings.maxDailyLossR,
    ),
    maxConsecutiveLosses: toPositiveNumber(
      value.maxConsecutiveLosses,
      defaultRiskSettings.maxConsecutiveLosses,
    ),
    minimumRequiredRiskReward: toPositiveNumber(
      value.minimumRequiredRiskReward,
      defaultRiskSettings.minimumRequiredRiskReward,
    ),
  };
}

export function getRiskSettings(
  storage: RiskSettingsStorage,
): RiskSettingsStorageResult {
  try {
    const rawValue = storage.getItem(STORAGE_KEY);

    if (rawValue === null) {
      return {
        settings: defaultRiskSettings,
        errorMessage: null,
      };
    }

    return {
      settings: normalizeRiskSettings(JSON.parse(rawValue)),
      errorMessage: null,
    };
  } catch {
    return {
      settings: defaultRiskSettings,
      errorMessage: "Risk settings could not be loaded.",
    };
  }
}

export function saveRiskSettings(
  storage: RiskSettingsStorage,
  settings: RiskSettings,
) {
  storage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function toRiskSettingsDraft(settings: RiskSettings) {
  return {
    maxTradesPerDay: String(settings.maxTradesPerDay),
    maxDailyLossR: String(settings.maxDailyLossR),
    maxConsecutiveLosses: String(settings.maxConsecutiveLosses),
    minimumRequiredRiskReward: String(settings.minimumRequiredRiskReward),
  };
}

export function fromRiskSettingsDraft(
  draft: ReturnType<typeof toRiskSettingsDraft>,
): RiskSettings {
  return {
    maxTradesPerDay: Number(draft.maxTradesPerDay),
    maxDailyLossR: Number(draft.maxDailyLossR),
    maxConsecutiveLosses: Number(draft.maxConsecutiveLosses),
    minimumRequiredRiskReward: Number(draft.minimumRequiredRiskReward),
  };
}
