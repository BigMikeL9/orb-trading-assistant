"use client";

import { Badge } from "@/components/ui/Badge";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import {
  Checkbox,
  CheckboxLabel,
  CheckboxList,
  ErrorText,
  Grid,
  Header,
  HelperText,
  List,
  ListItem,
  Output,
  OutputTitle,
  Panel,
  SaveButton,
  Select,
  TextArea,
  Title,
  TitleGroup,
} from "./PreMarketBias.styles";
import type { PreMarketBiasProps } from "./PreMarketBias.types";

function formatPreferredDirection(direction: string) {
  return direction === "avoid-trading" ? "Avoid trading" : direction;
}

export function PreMarketBias({
  draft,
  errorMessage,
  evaluation,
  isLoading,
  onDraftChange,
  onSaveBias,
}: PreMarketBiasProps) {
  return (
    <Panel aria-labelledby="pre-market-bias-title">
      <Header>
        <TitleGroup>
          <Title id="pre-market-bias-title">Pre-market bias</Title>
          <HelperText>
            Define context before planning the opening range breakout.
          </HelperText>
        </TitleGroup>
        <Badge
          tone={
            evaluation.preferredDirection === "avoid-trading"
              ? "fail"
              : "neutral"
          }
        >
          {formatPreferredDirection(evaluation.preferredDirection)}
        </Badge>
      </Header>

      {isLoading ? <HelperText>Loading pre-market bias...</HelperText> : null}
      {errorMessage !== null ? <ErrorText>{errorMessage}</ErrorText> : null}

      <Grid>
        <Field>
          Market bias
          <Select
            value={draft.bias}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                bias: event.target.value === "bullish"
                  ? "bullish"
                  : event.target.value === "bearish"
                    ? "bearish"
                    : "neutral",
              })
            }
          >
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </Select>
        </Field>
        <Field>
          Market condition
          <Select
            value={draft.marketCondition}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                marketCondition:
                  event.target.value === "trending"
                    ? "trending"
                    : event.target.value === "choppy"
                      ? "choppy"
                      : event.target.value === "range-bound"
                        ? "range-bound"
                        : "unclear",
              })
            }
          >
            <option value="trending">Trending</option>
            <option value="choppy">Choppy</option>
            <option value="range-bound">Range-bound</option>
            <option value="unclear">Unclear</option>
          </Select>
        </Field>
        <Field>
          Key support
          <Input
            value={draft.keySupport}
            onChange={(event) =>
              onDraftChange({ ...draft, keySupport: event.target.value })
            }
          />
        </Field>
        <Field>
          Key resistance
          <Input
            value={draft.keyResistance}
            onChange={(event) =>
              onDraftChange({ ...draft, keyResistance: event.target.value })
            }
          />
        </Field>
        <Field>
          Confidence score
          <Input
            inputMode="numeric"
            value={draft.confidenceScore}
            onChange={(event) =>
              onDraftChange({ ...draft, confidenceScore: event.target.value })
            }
          />
        </Field>
      </Grid>

      <Field>
        Liquidity zone / AOI notes
        <TextArea
          value={draft.liquidityZoneNotes}
          onChange={(event) =>
            onDraftChange({ ...draft, liquidityZoneNotes: event.target.value })
          }
        />
      </Field>

      <CheckboxList>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={draft.isHigherTimeframeTrendAligned}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                isHigherTimeframeTrendAligned: event.target.checked,
              })
            }
          />
          Higher timeframe trend aligned
        </CheckboxLabel>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={draft.isTradingWithTrend}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                isTradingWithTrend: event.target.checked,
              })
            }
          />
          Trading with trend
        </CheckboxLabel>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={draft.hasMajorLevelsNearby}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                hasMajorLevelsNearby: event.target.checked,
              })
            }
          />
          Major levels nearby
        </CheckboxLabel>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={draft.hasHighImpactNews}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                hasHighImpactNews: event.target.checked,
              })
            }
          />
          High impact news today
        </CheckboxLabel>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={draft.shouldAvoidTradingToday}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                shouldAvoidTradingToday: event.target.checked,
              })
            }
          />
          Avoid trading today
        </CheckboxLabel>
      </CheckboxList>

      <Output aria-label="Pre-market checklist output">
        <OutputTitle>Checklist output</OutputTitle>
        <HelperText>{evaluation.biasSummary}</HelperText>
        {evaluation.warnings.length > 0 ? (
          <List>
            {evaluation.warnings.map((warning) => (
              <ListItem key={warning}>{warning}</ListItem>
            ))}
          </List>
        ) : (
          <HelperText>No context warnings.</HelperText>
        )}
        {evaluation.noTradeRecommendations.length > 0 ? (
          <List>
            {evaluation.noTradeRecommendations.map((recommendation) => (
              <ListItem key={recommendation}>{recommendation}</ListItem>
            ))}
          </List>
        ) : (
          <HelperText>No pre-market no-trade recommendation.</HelperText>
        )}
      </Output>

      <SaveButton type="button" disabled={isLoading} onClick={onSaveBias}>
        Save pre-market bias
      </SaveButton>
    </Panel>
  );
}
