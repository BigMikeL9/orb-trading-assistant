import type { Dispatch, SetStateAction } from "react";
import type { SetupConfirmations } from "@/domain/orb/models";
import type { SetupDraft } from "../SetupEntry";

export type ConfirmationKey = keyof SetupConfirmations;

export type SetupFormProps = {
  draft: SetupDraft;
  onDraftChange: Dispatch<SetStateAction<SetupDraft>>;
  onSaveSetup: () => void;
  saveErrorMessage: string | null;
};
