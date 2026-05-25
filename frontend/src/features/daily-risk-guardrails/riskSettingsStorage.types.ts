import type { RiskSettings } from "@/domain/orb/models";

export type RiskSettingsStorage = Pick<Storage, "getItem" | "setItem">;

export type RiskSettingsDraft = {
  maxTradesPerDay: string;
  maxDailyLossR: string;
  maxConsecutiveLosses: string;
  minimumRequiredRiskReward: string;
};

export type RiskSettingsStorageResult =
  | {
      settings: RiskSettings;
      errorMessage: null;
    }
  | {
      settings: RiskSettings;
      errorMessage: string;
    };
