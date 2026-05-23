import type { PreMarketBiasInput } from "@/domain/orb/models";

export type PreMarketBiasStorage = Pick<Storage, "getItem" | "setItem">;

export type PreMarketBiasDraft = {
  bias: PreMarketBiasInput["bias"];
  isHigherTimeframeTrendAligned: boolean;
  isTradingWithTrend: boolean;
  marketCondition: PreMarketBiasInput["marketCondition"];
  keySupport: string;
  keyResistance: string;
  liquidityZoneNotes: string;
  hasMajorLevelsNearby: boolean;
  hasHighImpactNews: boolean;
  shouldAvoidTradingToday: boolean;
  confidenceScore: string;
};

export type PreMarketBiasStorageResult =
  | {
      draft: PreMarketBiasDraft;
      errorMessage: null;
    }
  | {
      draft: PreMarketBiasDraft;
      errorMessage: string;
    };
