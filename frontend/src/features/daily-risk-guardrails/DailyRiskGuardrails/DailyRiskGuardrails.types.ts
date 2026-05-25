import type {
  DailyRiskGuardrailsEvaluation,
  RiskSettings,
} from "@/domain/orb/models";
import type { RiskSettingsDraft } from "../riskSettingsStorage.types";

export type DailyRiskGuardrailsProps = {
  draft: RiskSettingsDraft;
  errorMessage: string | null;
  evaluation: DailyRiskGuardrailsEvaluation;
  isLoading: boolean;
  settings: RiskSettings;
  onDraftChange: (draft: RiskSettingsDraft) => void;
  onSaveSettings: () => void;
};
