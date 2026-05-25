"use client";

import { Badge, type BadgeTone } from "@/components/ui/Badge";
import {
  ContextHeader,
  ContextSummary,
  EmptyText,
  Header,
  List,
  ListItem,
  Metric,
  MetricLabel,
  MetricValue,
  ResultsCard,
  Section,
  SectionTitle,
  Title,
  VerdictMessage,
} from "./EvaluationResults.styles";
import type { EvaluationResultsProps } from "./EvaluationResults.types";

const verdictTone: Record<
  EvaluationResultsProps["evaluation"]["verdict"],
  BadgeTone
> = {
  valid: "pass",
  invalid: "fail",
  "no-trade": "warning",
};

const preferredDirectionTone: Record<
  NonNullable<EvaluationResultsProps["preMarketBias"]>["preferredDirection"],
  BadgeTone
> = {
  long: "pass",
  short: "pass",
  both: "neutral",
  "avoid-trading": "fail",
};

function formatVerdict(verdict: EvaluationResultsProps["evaluation"]["verdict"]) {
  return verdict === "no-trade" ? "No trade" : verdict;
}

function formatRatio(ratio: number | null) {
  return ratio === null ? "N/A" : `${ratio.toFixed(2)}R`;
}

function formatPreferredDirection(
  direction: NonNullable<
    EvaluationResultsProps["preMarketBias"]
  >["preferredDirection"],
) {
  return direction === "avoid-trading" ? "Avoid trading" : direction;
}

function getVerdictMessage(
  verdict: EvaluationResultsProps["evaluation"]["verdict"],
) {
  if (verdict === "valid") {
    return "Setup rules pass. Confirm daily guardrails before taking the trade.";
  }

  if (verdict === "no-trade") {
    return "No-trade condition is active. Do not take this setup as planned.";
  }

  return "Required setup rules are failing. Fix the plan or skip the trade.";
}

export function EvaluationResults({
  evaluation,
  preMarketBias,
}: EvaluationResultsProps) {
  return (
    <ResultsCard aria-labelledby="evaluation-title" aria-live="polite">
      <Header>
        <Title id="evaluation-title">Evaluation</Title>
        <Badge tone={verdictTone[evaluation.verdict]}>
          {formatVerdict(evaluation.verdict)}
        </Badge>
      </Header>

      <Metric>
        <MetricLabel>Risk/reward</MetricLabel>
        <MetricValue>{formatRatio(evaluation.riskReward.ratio)}</MetricValue>
      </Metric>

      {preMarketBias !== undefined ? (
        <ContextSummary aria-label="Pre-market context summary">
          <ContextHeader>
            <SectionTitle>Pre-market context</SectionTitle>
            <Badge tone={preferredDirectionTone[preMarketBias.preferredDirection]}>
              {formatPreferredDirection(preMarketBias.preferredDirection)}
            </Badge>
          </ContextHeader>
          <EmptyText>{preMarketBias.biasSummary}</EmptyText>
        </ContextSummary>
      ) : null}

      <VerdictMessage>{getVerdictMessage(evaluation.verdict)}</VerdictMessage>

      <Section>
        <SectionTitle>Passed rules</SectionTitle>
        {evaluation.passedRules.length > 0 ? (
          <List>
            {evaluation.passedRules.map((rule) => (
              <ListItem key={rule.id}>{rule.label}</ListItem>
            ))}
          </List>
        ) : (
          <EmptyText>No rules have passed yet.</EmptyText>
        )}
      </Section>

      <Section>
        <SectionTitle>Failed rules</SectionTitle>
        {evaluation.failedRules.length > 0 ? (
          <List>
            {evaluation.failedRules.map((rule) => (
              <ListItem key={rule.id}>{rule.message}</ListItem>
            ))}
          </List>
        ) : (
          <EmptyText>No failed rules.</EmptyText>
        )}
      </Section>

      <Section>
        <SectionTitle>Warnings</SectionTitle>
        {evaluation.warnings.length > 0 ? (
          <List>
            {evaluation.warnings.map((rule) => (
              <ListItem key={rule.id}>{rule.message}</ListItem>
            ))}
          </List>
        ) : (
          <EmptyText>No warnings.</EmptyText>
        )}
      </Section>

      <Section>
        <SectionTitle>Active no-trade reasons</SectionTitle>
        {evaluation.noTradeReasons.length > 0 ? (
          <List>
            {evaluation.noTradeReasons.map((reason) => (
              <ListItem key={reason}>{reason}</ListItem>
            ))}
          </List>
        ) : (
          <EmptyText>No setup-level no-trade condition is active.</EmptyText>
        )}
      </Section>
    </ResultsCard>
  );
}
