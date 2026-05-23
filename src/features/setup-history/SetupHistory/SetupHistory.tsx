"use client";

import { useMemo, useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { calculateJournalAnalytics } from "@/domain/orb/journalAnalytics";
import type { TradeJournalStatus } from "@/domain/orb/models";
import { JournalAnalyticsSummary } from "../JournalAnalyticsSummary";
import { TradeJournalEditor } from "../TradeJournalEditor";
import {
  Actions,
  DangerButton,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  Header,
  HelperText,
  HistoryCard,
  ModalActions,
  SecondaryButton,
  SymbolCell,
  Table,
  TableCell,
  TableHeaderCell,
  TableScroll,
  TableStatus,
  Title,
} from "./SetupHistory.styles";
import type { SetupHistoryProps } from "./SetupHistory.types";

const verdictTone: Record<
  SetupHistoryProps["savedSetups"][number]["evaluation"]["verdict"],
  BadgeTone
> = {
  valid: "pass",
  invalid: "fail",
  "no-trade": "warning",
};

const journalTone: Record<TradeJournalStatus, BadgeTone> = {
  planned: "neutral",
  taken: "warning",
  skipped: "neutral",
  win: "pass",
  loss: "fail",
  breakeven: "warning",
};

function formatSavedAt(savedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(savedAt));
}

function formatRatio(ratio: number | null) {
  return ratio === null ? "N/A" : `${ratio.toFixed(2)}R`;
}

function formatJournalStatus(status: TradeJournalStatus) {
  return status === "breakeven" ? "Breakeven" : status;
}

function formatRealizedR(realizedR: number | undefined) {
  return realizedR === undefined ? "N/A" : `${realizedR.toFixed(2)}R`;
}

function formatVerdict(verdict: SetupHistoryProps["savedSetups"][number]["evaluation"]["verdict"]) {
  return verdict === "no-trade" ? "No trade" : verdict;
}

export function SetupHistory({
  errorMessage,
  isLoading,
  onDeleteSetup,
  onSaveJournal,
  onSelectSetup,
  savedSetups,
}: SetupHistoryProps) {
  const analytics = calculateJournalAnalytics(savedSetups);
  const [selectedSetupId, setSelectedSetupId] = useState<string | null>(null);
  const selectedSetup = useMemo(
    () => savedSetups.find((setup) => setup.id === selectedSetupId) ?? null,
    [savedSetups, selectedSetupId],
  );

  function handleDeleteSelectedSetup() {
    if (selectedSetup === null) {
      return;
    }

    onDeleteSetup(selectedSetup.id);
    setSelectedSetupId(null);
  }

  function handleReloadSelectedSetup() {
    if (selectedSetup === null) {
      return;
    }

    onSelectSetup(selectedSetup);
    setSelectedSetupId(null);
  }

  return (
    <HistoryCard aria-labelledby="setup-history-title">
      <Header>
        <Title id="setup-history-title">Setup history</Title>
        <HelperText>Saved locally in this browser.</HelperText>
      </Header>

      {isLoading ? <HelperText>Loading saved setups...</HelperText> : null}

      {errorMessage !== null ? <HelperText>{errorMessage}</HelperText> : null}

      {!isLoading && errorMessage === null ? (
        <JournalAnalyticsSummary analytics={analytics} />
      ) : null}

      {!isLoading && errorMessage === null && savedSetups.length === 0 ? (
        <HelperText>
          No saved setups yet. Save an evaluated setup to begin journaling and
          risk review.
        </HelperText>
      ) : null}

      {!isLoading && errorMessage === null && savedSetups.length > 0 ? (
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <TableHeaderCell scope="col">Market date</TableHeaderCell>
                <TableHeaderCell scope="col">Symbol</TableHeaderCell>
                <TableHeaderCell scope="col">Direction</TableHeaderCell>
                <TableHeaderCell scope="col">Verdict</TableHeaderCell>
                <TableHeaderCell scope="col">Risk/reward</TableHeaderCell>
                <TableHeaderCell scope="col">Status</TableHeaderCell>
                <TableHeaderCell scope="col">Realized R</TableHeaderCell>
                <TableHeaderCell scope="col">Created</TableHeaderCell>
                <TableHeaderCell scope="col">Actions</TableHeaderCell>
              </tr>
            </thead>
            <tbody>
              {savedSetups.map((setup) => {
                const symbol =
                  setup.draft.symbol.trim().toUpperCase() || "Untitled";

                return (
                  <tr key={setup.id}>
                    <TableCell>{setup.draft.marketDate || "No date"}</TableCell>
                    <TableCell>
                      <SymbolCell>{symbol}</SymbolCell>
                    </TableCell>
                    <TableCell>{setup.draft.direction}</TableCell>
                    <TableCell>
                      <Badge tone={verdictTone[setup.evaluation.verdict]}>
                        {formatVerdict(setup.evaluation.verdict)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatRatio(setup.evaluation.riskReward.ratio)}
                    </TableCell>
                    <TableCell>
                      <Badge tone={journalTone[setup.journal.status]}>
                        {formatJournalStatus(setup.journal.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatRealizedR(setup.journal.realizedR)}</TableCell>
                    <TableCell>{formatSavedAt(setup.savedAt)}</TableCell>
                    <TableCell>
                      <Actions>
                        <SecondaryButton
                          type="button"
                          aria-label={`View / Edit ${symbol} setup`}
                          onClick={() => setSelectedSetupId(setup.id)}
                        >
                          View / Edit
                        </SecondaryButton>
                      </Actions>
                    </TableCell>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableScroll>
      ) : null}

      <Modal
        isOpen={selectedSetup !== null}
        title={
          selectedSetup === null
            ? "Setup details"
            : `Edit ${
                selectedSetup.draft.symbol.trim().toUpperCase() || "Untitled"
              } ${selectedSetup.draft.direction} setup`
        }
        onClose={() => setSelectedSetupId(null)}
      >
        {selectedSetup !== null ? (
          <>
            <TableStatus>
              <Badge tone={verdictTone[selectedSetup.evaluation.verdict]}>
                {formatVerdict(selectedSetup.evaluation.verdict)}
              </Badge>
              <Badge tone={journalTone[selectedSetup.journal.status]}>
                {formatJournalStatus(selectedSetup.journal.status)}
              </Badge>
            </TableStatus>

            <DetailGrid aria-label="Saved setup details">
              <DetailItem>
                <DetailLabel>Market date</DetailLabel>
                <DetailValue>
                  {selectedSetup.draft.marketDate || "No date"}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Opening range</DetailLabel>
                <DetailValue>
                  {selectedSetup.draft.openingRangeLow || "N/A"} -{" "}
                  {selectedSetup.draft.openingRangeHigh || "N/A"}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Entry / Stop / Target</DetailLabel>
                <DetailValue>
                  {selectedSetup.draft.entryPrice || "N/A"} /{" "}
                  {selectedSetup.draft.stopPrice || "N/A"} /{" "}
                  {selectedSetup.draft.targetPrice || "N/A"}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Risk/reward</DetailLabel>
                <DetailValue>
                  {formatRatio(selectedSetup.evaluation.riskReward.ratio)}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Created</DetailLabel>
                <DetailValue>{formatSavedAt(selectedSetup.savedAt)}</DetailValue>
              </DetailItem>
            </DetailGrid>

            <TradeJournalEditor
              journal={selectedSetup.journal}
              onSaveJournal={(journal) =>
                onSaveJournal(selectedSetup.id, journal)
              }
            />

            <ModalActions>
              <SecondaryButton
                type="button"
                onClick={handleReloadSelectedSetup}
              >
                Reload setup
              </SecondaryButton>
              <DangerButton type="button" onClick={handleDeleteSelectedSetup}>
                Delete setup
              </DangerButton>
            </ModalActions>
          </>
        ) : null}
      </Modal>
    </HistoryCard>
  );
}
