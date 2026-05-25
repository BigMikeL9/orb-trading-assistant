import type { TradeJournal, TradeJournalStatus } from "@/domain/orb/models";

export type TradeJournalDraft = {
  status: TradeJournalStatus;
  actualEntry: string;
  actualExit: string;
  realizedR: string;
  mistakeNotes: string;
  lessonLearned: string;
};

export type TradeJournalEditorProps = {
  journal: TradeJournal;
  onSaveJournal: (journal: TradeJournal) => void;
};
