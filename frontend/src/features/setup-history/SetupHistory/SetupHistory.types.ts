import type { TradeJournal } from "@/domain/orb/models";
import type { SavedSetup } from "../setupStorage.types";

export type SetupHistoryProps = {
  errorMessage: string | null;
  isLoading: boolean;
  savedSetups: SavedSetup[];
  onDeleteSetup: (setupId: string) => void;
  onSaveJournal: (setupId: string, journal: TradeJournal) => void;
  onSelectSetup: (setup: SavedSetup) => void;
};
