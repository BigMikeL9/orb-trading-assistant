import type { SetupEvaluation, TradeJournal } from "@/domain/orb/models";
import type { SetupDraft } from "@/features/setup-entry/SetupEntry";

export type SavedSetup = {
  id: string;
  savedAt: string;
  draft: SetupDraft;
  evaluation: SetupEvaluation;
  journal: TradeJournal;
};

export type SetupStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
