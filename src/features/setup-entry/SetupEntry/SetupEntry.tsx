"use client";

import { useEffect, useMemo, useState } from "react";
import { evaluateSetup } from "@/domain/orb/evaluateSetup";
import { evaluatePreMarketBias } from "@/domain/orb/preMarketBias";
import { evaluateDailyRiskGuardrails } from "@/domain/orb/riskGuardrails";
import type { TradeSetup } from "@/domain/orb/models";
import {
  DailyRiskGuardrails,
  fromRiskSettingsDraft,
  getRiskSettings,
  saveRiskSettings,
  toRiskSettingsDraft,
  type RiskSettingsDraft,
} from "@/features/daily-risk-guardrails";
import {
  defaultPreMarketBiasDraft,
  getPreMarketBiasDraft,
  PreMarketBias,
  savePreMarketBiasDraft,
  toPreMarketBiasInput,
  type PreMarketBiasDraft,
} from "@/features/pre-market-bias";
import {
  deleteSavedSetup,
  getSavedSetups,
  saveSetup,
  SetupHistory,
  updateSavedSetupJournal,
  type SavedSetup,
} from "@/features/setup-history";
import type { TradeJournal } from "@/domain/orb/models";
import { defaultRiskSettings } from "@/domain/orb/riskGuardrails";
import { EvaluationResults } from "../EvaluationResults";
import { SetupForm } from "../SetupForm";
import {
  Description,
  Header,
  Layout,
  MainColumn,
  Page,
  SideColumn,
  Title,
} from "./SetupEntry.styles";
import type { SetupDraft } from "./SetupEntry.types";

const initialDraft: SetupDraft = {
  symbol: "",
  marketDate: "",
  openingRangeHigh: "",
  openingRangeLow: "",
  direction: "long",
  entryPrice: "",
  stopPrice: "",
  targetPrice: "",
  confirmations: {
    brokeOpeningRange: false,
    heldRetest: false,
    volumeConfirmed: false,
    trendAligned: false,
    avoidedChop: false,
  },
};

function toNumber(value: string) {
  return value.trim() === "" ? Number.NaN : Number(value);
}

function toTradeSetup(draft: SetupDraft): TradeSetup {
  return {
    session: {
      symbol: draft.symbol.trim().toUpperCase(),
      marketDate: draft.marketDate,
      high: toNumber(draft.openingRangeHigh),
      low: toNumber(draft.openingRangeLow),
    },
    direction: draft.direction,
    entryPrice: toNumber(draft.entryPrice),
    stopPrice: toNumber(draft.stopPrice),
    targetPrice: toNumber(draft.targetPrice),
    confirmations: draft.confirmations,
  };
}

export function SetupEntry() {
  const [draft, setDraft] = useState(initialDraft);
  const [preMarketBiasDraft, setPreMarketBiasDraft] =
    useState<PreMarketBiasDraft>(defaultPreMarketBiasDraft);
  const [isPreMarketBiasLoading, setIsPreMarketBiasLoading] = useState(true);
  const [preMarketBiasErrorMessage, setPreMarketBiasErrorMessage] = useState<
    string | null
  >(null);
  const [riskSettings, setRiskSettings] = useState(defaultRiskSettings);
  const [riskSettingsDraft, setRiskSettingsDraft] = useState<RiskSettingsDraft>(
    () => toRiskSettingsDraft(defaultRiskSettings),
  );
  const [isRiskSettingsLoading, setIsRiskSettingsLoading] = useState(true);
  const [riskSettingsErrorMessage, setRiskSettingsErrorMessage] = useState<
    string | null
  >(null);
  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyErrorMessage, setHistoryErrorMessage] = useState<string | null>(
    null,
  );
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const setup = useMemo(() => toTradeSetup(draft), [draft]);
  const preMarketBiasEvaluation = useMemo(
    () => evaluatePreMarketBias(toPreMarketBiasInput(preMarketBiasDraft)),
    [preMarketBiasDraft],
  );
  const evaluation = useMemo(
    () =>
      evaluateSetup(setup, {
        minimumRequiredRiskReward: riskSettings.minimumRequiredRiskReward,
        preMarketBias: preMarketBiasEvaluation,
      }),
    [preMarketBiasEvaluation, riskSettings.minimumRequiredRiskReward, setup],
  );
  const dailyRiskEvaluation = useMemo(
    () =>
      evaluateDailyRiskGuardrails(
        savedSetups.map((savedSetup) => ({
          savedAt: savedSetup.savedAt,
          marketDate: savedSetup.draft.marketDate,
          journal: savedSetup.journal,
        })),
        draft.marketDate,
        riskSettings,
      ),
    [draft.marketDate, riskSettings, savedSetups],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        setSavedSetups(getSavedSetups(window.localStorage));
        setHistoryErrorMessage(null);
      } catch {
        setHistoryErrorMessage("Saved setup history could not be loaded.");
      } finally {
        setIsHistoryLoading(false);
      }

      const riskSettingsResult = getRiskSettings(window.localStorage);
      setRiskSettings(riskSettingsResult.settings);
      setRiskSettingsDraft(toRiskSettingsDraft(riskSettingsResult.settings));
      setRiskSettingsErrorMessage(riskSettingsResult.errorMessage);
      setIsRiskSettingsLoading(false);

      const preMarketBiasResult = getPreMarketBiasDraft(window.localStorage);
      setPreMarketBiasDraft(preMarketBiasResult.draft);
      setPreMarketBiasErrorMessage(preMarketBiasResult.errorMessage);
      setIsPreMarketBiasLoading(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleSaveSetup() {
    try {
      const savedSetup = saveSetup(window.localStorage, {
        draft,
        evaluation,
      });
      setSavedSetups((current) => [savedSetup, ...current]);
      setIsHistoryLoading(false);
      setSaveErrorMessage(null);
      setHistoryErrorMessage(null);
    } catch {
      setSaveErrorMessage("Setup could not be saved in this browser.");
    }
  }

  function handleDeleteSetup(setupId: string) {
    try {
      deleteSavedSetup(window.localStorage, setupId);
      setSavedSetups((current) =>
        current.filter((savedSetup) => savedSetup.id !== setupId),
      );
      setIsHistoryLoading(false);
      setHistoryErrorMessage(null);
    } catch {
      setHistoryErrorMessage("Saved setup could not be deleted.");
    }
  }

  function handleSelectSetup(savedSetup: SavedSetup) {
    setDraft(savedSetup.draft);
    setSaveErrorMessage(null);
  }

  function handleSaveJournal(setupId: string, journal: TradeJournal) {
    try {
      const updatedSetup = updateSavedSetupJournal(
        window.localStorage,
        setupId,
        journal,
      );

      if (updatedSetup === null) {
        throw new Error("Saved setup was not found.");
      }

      setSavedSetups((current) =>
        current.map((savedSetup) =>
          savedSetup.id === setupId ? updatedSetup : savedSetup,
        ),
      );
      setHistoryErrorMessage(null);
    } catch {
      setHistoryErrorMessage("Journal details could not be saved.");
    }
  }

  function handleSaveRiskSettings() {
    const nextSettings = fromRiskSettingsDraft(riskSettingsDraft);
    const hasInvalidSetting = Object.values(nextSettings).some(
      (value) => !Number.isFinite(value) || value <= 0,
    );

    if (hasInvalidSetting) {
      setRiskSettingsErrorMessage("Risk settings must be positive numbers.");
      return;
    }

    try {
      saveRiskSettings(window.localStorage, nextSettings);
      setRiskSettings(nextSettings);
      setRiskSettingsDraft(toRiskSettingsDraft(nextSettings));
      setRiskSettingsErrorMessage(null);
    } catch {
      setRiskSettingsErrorMessage("Risk settings could not be saved.");
    }
  }

  function handleSavePreMarketBias() {
    try {
      savePreMarketBiasDraft(window.localStorage, preMarketBiasDraft);
      setPreMarketBiasErrorMessage(null);
    } catch {
      setPreMarketBiasErrorMessage("Pre-market bias could not be saved.");
    }
  }

  return (
    <Page>
      <Header>
        <Title>ORB Setup Evaluation</Title>
        <Description>
          Plan the trade, check the rules, then decide whether it belongs on
          today&apos;s execution list.
        </Description>
      </Header>
      <Layout>
        <MainColumn>
          <PreMarketBias
            draft={preMarketBiasDraft}
            errorMessage={preMarketBiasErrorMessage}
            evaluation={preMarketBiasEvaluation}
            isLoading={isPreMarketBiasLoading}
            onDraftChange={setPreMarketBiasDraft}
            onSaveBias={handleSavePreMarketBias}
          />
          <SetupForm
            draft={draft}
            onDraftChange={setDraft}
            onSaveSetup={handleSaveSetup}
            saveErrorMessage={saveErrorMessage}
          />
          <DailyRiskGuardrails
            draft={riskSettingsDraft}
            errorMessage={riskSettingsErrorMessage}
            evaluation={dailyRiskEvaluation}
            isLoading={isRiskSettingsLoading}
            settings={riskSettings}
            onDraftChange={setRiskSettingsDraft}
            onSaveSettings={handleSaveRiskSettings}
          />
          <SetupHistory
            errorMessage={historyErrorMessage}
            isLoading={isHistoryLoading}
            savedSetups={savedSetups}
            onDeleteSetup={handleDeleteSetup}
            onSaveJournal={handleSaveJournal}
            onSelectSetup={handleSelectSetup}
          />
        </MainColumn>
        <SideColumn>
          <EvaluationResults
            evaluation={evaluation}
            preMarketBias={preMarketBiasEvaluation}
          />
        </SideColumn>
      </Layout>
    </Page>
  );
}
