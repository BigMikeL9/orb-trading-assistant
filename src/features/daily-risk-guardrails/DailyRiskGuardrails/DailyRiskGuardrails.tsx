"use client";

import { Badge } from "@/components/ui/Badge";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import {
  ErrorText,
  Header,
  HelperText,
  Metric,
  MetricGrid,
  MetricLabel,
  MetricValue,
  Panel,
  Reason,
  ReasonsList,
  SaveButton,
  SettingsGrid,
  Title,
  TitleGroup,
} from "./DailyRiskGuardrails.styles";
import type { DailyRiskGuardrailsProps } from "./DailyRiskGuardrails.types";

function formatRealizedR(value: number) {
  return `${value.toFixed(2)}R`;
}

export function DailyRiskGuardrails({
  draft,
  errorMessage,
  evaluation,
  isLoading,
  onDraftChange,
  onSaveSettings,
}: DailyRiskGuardrailsProps) {
  const dateLabel = evaluation.marketDate || "the selected market date";

  return (
    <Panel aria-labelledby="daily-risk-guardrails-title" aria-live="polite">
      <Header>
        <TitleGroup>
          <Title id="daily-risk-guardrails-title">Daily risk guardrails</Title>
          <HelperText>
            {evaluation.marketDate
              ? `Applies to saved trades for ${dateLabel}.`
              : "Select a market date to evaluate daily limits."}
          </HelperText>
        </TitleGroup>
        <Badge tone={evaluation.isTradingAllowed ? "pass" : "fail"}>
          {evaluation.isTradingAllowed ? "Trading allowed" : "Trading locked"}
        </Badge>
      </Header>

      {isLoading ? <HelperText>Loading risk settings...</HelperText> : null}
      {errorMessage !== null ? <ErrorText>{errorMessage}</ErrorText> : null}

      <MetricGrid>
        <Metric>
          <MetricLabel>Taken today</MetricLabel>
          <MetricValue>{evaluation.tradesTakenToday}</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>Realized R today</MetricLabel>
          <MetricValue>{formatRealizedR(evaluation.totalRealizedRToday)}</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>Consecutive losses</MetricLabel>
          <MetricValue>{evaluation.consecutiveLosses}</MetricValue>
        </Metric>
      </MetricGrid>

      {evaluation.noTradeReasons.length > 0 ? (
        <ReasonsList>
          {evaluation.noTradeReasons.map((reason) => (
            <Reason key={reason}>{reason}</Reason>
          ))}
        </ReasonsList>
      ) : (
        <HelperText>
          No daily risk limit is currently hit for {dateLabel}.
        </HelperText>
      )}

      <SettingsGrid>
        <Field>
          Max trades/day
          <Input
            inputMode="numeric"
            value={draft.maxTradesPerDay}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                maxTradesPerDay: event.target.value,
              })
            }
          />
        </Field>
        <Field>
          Max daily loss R
          <Input
            inputMode="decimal"
            value={draft.maxDailyLossR}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                maxDailyLossR: event.target.value,
              })
            }
          />
        </Field>
        <Field>
          Max consecutive losses
          <Input
            inputMode="numeric"
            value={draft.maxConsecutiveLosses}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                maxConsecutiveLosses: event.target.value,
              })
            }
          />
        </Field>
        <Field>
          Minimum required R/R
          <Input
            inputMode="decimal"
            value={draft.minimumRequiredRiskReward}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                minimumRequiredRiskReward: event.target.value,
              })
            }
          />
        </Field>
      </SettingsGrid>

      <SaveButton type="button" disabled={isLoading} onClick={onSaveSettings}>
        Save risk settings
      </SaveButton>
    </Panel>
  );
}
