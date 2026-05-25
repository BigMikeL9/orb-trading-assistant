import type { PreMarketBiasEvaluation, SetupEvaluation } from "@/domain/orb/models";

export type EvaluationResultsProps = {
  evaluation: SetupEvaluation;
  preMarketBias?: PreMarketBiasEvaluation;
};
