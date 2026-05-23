import type { PreMarketBiasEvaluation } from "@/domain/orb/models";
import type { PreMarketBiasDraft } from "../preMarketBiasStorage.types";

export type PreMarketBiasProps = {
  draft: PreMarketBiasDraft;
  errorMessage: string | null;
  evaluation: PreMarketBiasEvaluation;
  isLoading: boolean;
  onDraftChange: (draft: PreMarketBiasDraft) => void;
  onSaveBias: () => void;
};
