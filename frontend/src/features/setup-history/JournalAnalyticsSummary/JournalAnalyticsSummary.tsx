"use client";

import {
  Grid,
  Label,
  MetricCard,
  Summary,
  Value,
  WideMetricCard,
} from "./JournalAnalyticsSummary.styles";
import type { JournalAnalyticsSummaryProps } from "./JournalAnalyticsSummary.types";

function formatPercent(value: number | null) {
  return value === null ? "N/A" : `${Math.round(value * 100)}%`;
}

function formatRealizedR(value: number | null) {
  return value === null ? "N/A" : `${value.toFixed(2)}R`;
}

export function JournalAnalyticsSummary({
  analytics,
}: JournalAnalyticsSummaryProps) {
  return (
    <Summary aria-label="Journal analytics summary">
      <Grid>
        <MetricCard>
          <Label>Total setups</Label>
          <Value>{analytics.totalSetups}</Value>
        </MetricCard>
        <MetricCard>
          <Label>Taken</Label>
          <Value>{analytics.takenTrades}</Value>
        </MetricCard>
        <MetricCard>
          <Label>Skipped</Label>
          <Value>{analytics.skippedTrades}</Value>
        </MetricCard>
        <MetricCard>
          <Label>Win rate</Label>
          <Value>{formatPercent(analytics.winRate)}</Value>
        </MetricCard>
        <MetricCard>
          <Label>Wins</Label>
          <Value>{analytics.wins}</Value>
        </MetricCard>
        <MetricCard>
          <Label>Losses</Label>
          <Value>{analytics.losses}</Value>
        </MetricCard>
        <MetricCard>
          <Label>Breakeven</Label>
          <Value>{analytics.breakeven}</Value>
        </MetricCard>
        <MetricCard>
          <Label>Avg realized R</Label>
          <Value>{formatRealizedR(analytics.averageRealizedR)}</Value>
        </MetricCard>
        <WideMetricCard>
          <Label>Most common mistake</Label>
          <Value>{analytics.mostCommonMistakeNote ?? "None recorded"}</Value>
        </WideMetricCard>
      </Grid>
    </Summary>
  );
}
