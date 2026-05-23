"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { TradeJournal, TradeJournalStatus } from "@/domain/orb/models";
import {
  Editor,
  Grid,
  NotesGrid,
  SaveButton,
  Select,
  TextArea,
} from "./TradeJournalEditor.styles";
import type {
  TradeJournalDraft,
  TradeJournalEditorProps,
} from "./TradeJournalEditor.types";

const journalStatuses: Array<{ value: TradeJournalStatus; label: string }> = [
  { value: "planned", label: "Planned" },
  { value: "taken", label: "Taken" },
  { value: "skipped", label: "Skipped" },
  { value: "win", label: "Win" },
  { value: "loss", label: "Loss" },
  { value: "breakeven", label: "Breakeven" },
];

function formatOptionalNumber(value: number | undefined) {
  return value === undefined ? "" : String(value);
}

function parseOptionalNumber(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue === "") {
    return undefined;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function toDraft(journal: TradeJournal): TradeJournalDraft {
  return {
    status: journal.status,
    actualEntry: formatOptionalNumber(journal.actualEntry),
    actualExit: formatOptionalNumber(journal.actualExit),
    realizedR: formatOptionalNumber(journal.realizedR),
    mistakeNotes: journal.mistakeNotes ?? "",
    lessonLearned: journal.lessonLearned ?? "",
  };
}

function toJournal(draft: TradeJournalDraft): TradeJournal {
  return {
    status: draft.status,
    actualEntry: parseOptionalNumber(draft.actualEntry),
    actualExit: parseOptionalNumber(draft.actualExit),
    realizedR: parseOptionalNumber(draft.realizedR),
    mistakeNotes: draft.mistakeNotes.trim() || undefined,
    lessonLearned: draft.lessonLearned.trim() || undefined,
  };
}

export function TradeJournalEditor({
  journal,
  onSaveJournal,
}: TradeJournalEditorProps) {
  const [draft, setDraft] = useState(() => toDraft(journal));

  return (
    <Editor>
      <Grid>
        <Field>
          Journal status
          <Select
            value={draft.status}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                status: event.target.value as TradeJournalStatus,
              }))
            }
          >
            {journalStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          Actual entry
          <Input
            inputMode="decimal"
            value={draft.actualEntry}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                actualEntry: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          Actual exit
          <Input
            inputMode="decimal"
            value={draft.actualExit}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                actualExit: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          Realized R
          <Input
            inputMode="decimal"
            value={draft.realizedR}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                realizedR: event.target.value,
              }))
            }
          />
        </Field>
      </Grid>

      <NotesGrid>
        <Field>
          Mistake notes
          <TextArea
            value={draft.mistakeNotes}
            placeholder="Execution mistakes, hesitation, early exit..."
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                mistakeNotes: event.target.value,
              }))
            }
          />
        </Field>
        <Field>
          Lesson learned
          <TextArea
            value={draft.lessonLearned}
            placeholder="What should be repeated or avoided next time?"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                lessonLearned: event.target.value,
              }))
            }
          />
        </Field>
      </NotesGrid>

      <SaveButton type="button" onClick={() => onSaveJournal(toJournal(draft))}>
        Save journal
      </SaveButton>
    </Editor>
  );
}
