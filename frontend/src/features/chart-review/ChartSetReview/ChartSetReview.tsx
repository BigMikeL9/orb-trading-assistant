"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { createEmptyChartAnalysisResult } from "@/domain/chart-review/chartAnalysisPlaceholder";
import type {
  ChartImage,
  ChartSet,
  ChartTimeframe,
} from "@/domain/chart-review/models";
import { validateChartSet } from "@/domain/chart-review/validateChartSet";
import {
  ContextSelect,
  FileInput,
  FileLabel,
  Header,
  HelperText,
  MessageList,
  MissingMessage,
  Panel,
  Placeholder,
  PlaceholderTitle,
  Preview,
  PreviewImage,
  PreviewMeta,
  RemoveButton,
  Slot,
  SlotGrid,
  SlotHeader,
  SlotTitle,
  Title,
  TitleGroup,
  WarningMessage,
} from "./ChartSetReview.styles";
import type {
  ChartSetReviewProps,
  ChartSlot,
  UploadedCharts,
} from "./ChartSetReview.types";

const chartSlots: ChartSlot[] = [
  {
    label: "15m ORB chart",
    timeframe: "15m-orb",
    requirement: "required",
    helperText: "Opening range high, low, and breakout structure.",
  },
  {
    label: "5m execution chart",
    timeframe: "5m-execution",
    requirement: "required",
    helperText: "Execution detail for breakout, retest, and invalidation.",
  },
  {
    label: "Daily chart",
    timeframe: "daily",
    requirement: "optional",
    helperText: "Major levels, broader trend, and nearby resistance/support.",
  },
];

const timeframeLabels: Record<ChartTimeframe, string> = {
  "15m-orb": "15m ORB chart",
  "5m-execution": "5m execution chart",
  "1h-context": "1h context chart",
  "4h-context": "4h context chart",
  daily: "Daily chart",
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function createChartSet(charts: UploadedCharts): ChartSet {
  const timestamp = new Date().toISOString();

  return {
    id: "local-chart-set",
    symbol: "",
    marketDate: "",
    charts: Object.values(charts).filter((chart): chart is ChartImage =>
      Boolean(chart),
    ),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function getChart(charts: UploadedCharts, timeframe: ChartTimeframe) {
  return charts[timeframe];
}

function getContextChart(charts: UploadedCharts) {
  return charts["1h-context"] ?? charts["4h-context"];
}

function createId() {
  return crypto.randomUUID();
}

export function ChartSetReview({
  createId: createChartId = createId,
}: ChartSetReviewProps) {
  const [charts, setCharts] = useState<UploadedCharts>({});
  const [contextTimeframe, setContextTimeframe] =
    useState<ChartTimeframe>("1h-context");
  const validation = useMemo(
    () => validateChartSet(createChartSet(charts)),
    [charts],
  );
  const analysisPlaceholder = useMemo(
    () => createEmptyChartAnalysisResult(),
    [],
  );
  const contextChart = getContextChart(charts);

  async function handleFileChange(timeframe: ChartTimeframe, file: File | null) {
    if (file === null) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    const uploadedAt = new Date().toISOString();
    const chart: ChartImage = {
      id: createChartId(),
      timeframe,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      dataUrl,
      uploadedAt,
    };

    setCharts((current) => {
      if (timeframe === "1h-context" || timeframe === "4h-context") {
        const nextCharts = { ...current };
        delete nextCharts["1h-context"];
        delete nextCharts["4h-context"];

        return { ...nextCharts, [timeframe]: chart };
      }

      return { ...current, [timeframe]: chart };
    });
  }

  function removeChart(timeframe: ChartTimeframe) {
    setCharts((current) => {
      const remainingCharts = { ...current };
      delete remainingCharts[timeframe];

      return remainingCharts;
    });
  }

  function renderUploadSlot(slot: ChartSlot, chart: ChartImage | undefined) {
    return (
      <Slot key={slot.timeframe}>
        <SlotHeader>
          <div>
            <SlotTitle>{slot.label}</SlotTitle>
            <HelperText>{slot.helperText}</HelperText>
          </div>
          <Badge tone={slot.requirement === "required" ? "warning" : "neutral"}>
            {slot.requirement}
          </Badge>
        </SlotHeader>

        {chart !== undefined ? (
          <Preview>
            <PreviewImage src={chart.dataUrl} alt={`${slot.label} preview`} />
            <PreviewMeta>{chart.fileName}</PreviewMeta>
            <RemoveButton type="button" onClick={() => removeChart(slot.timeframe)}>
              Remove screenshot
            </RemoveButton>
          </Preview>
        ) : null}

        <FileLabel>
          {chart === undefined ? "Upload screenshot" : "Replace screenshot"}
          <FileInput
            type="file"
            accept="image/*"
            aria-label={slot.label}
            onChange={(event) =>
              void handleFileChange(
                slot.timeframe,
                event.target.files?.[0] ?? null,
              )
            }
          />
        </FileLabel>
      </Slot>
    );
  }

  return (
    <Panel aria-labelledby="chart-set-review-title">
      <Header>
        <TitleGroup>
          <Title id="chart-set-review-title">Chart set review</Title>
          <HelperText>
            Upload chart screenshots for later AI-assisted ORB/TTC context
            review. Manual setup entry remains the fallback.
          </HelperText>
        </TitleGroup>
        <Badge tone={validation.isValid ? "pass" : "warning"}>
          {validation.isValid ? "Ready for future analysis" : "Charts needed"}
        </Badge>
      </Header>

      <SlotGrid>
        {chartSlots.map((slot) => renderUploadSlot(slot, getChart(charts, slot.timeframe)))}

        <Slot>
          <SlotHeader>
            <div>
              <SlotTitle>1h or 4h context chart</SlotTitle>
              <HelperText>
                Optional higher timeframe structure for trend and key levels.
              </HelperText>
            </div>
            <Badge tone="neutral">optional</Badge>
          </SlotHeader>
          <ContextSelect
            aria-label="Context chart timeframe"
            value={contextTimeframe}
            onChange={(event) =>
              setContextTimeframe(
                event.target.value === "4h-context"
                  ? "4h-context"
                  : "1h-context",
              )
            }
          >
            <option value="1h-context">1h context</option>
            <option value="4h-context">4h context</option>
          </ContextSelect>

          {contextChart !== undefined ? (
            <Preview>
              <PreviewImage
                src={contextChart.dataUrl}
                alt={`${timeframeLabels[contextChart.timeframe]} preview`}
              />
              <PreviewMeta>
                {timeframeLabels[contextChart.timeframe]} /{" "}
                {contextChart.fileName}
              </PreviewMeta>
              <RemoveButton
                type="button"
                onClick={() => removeChart(contextChart.timeframe)}
              >
                Remove screenshot
              </RemoveButton>
            </Preview>
          ) : null}

          <FileLabel>
            {contextChart === undefined
              ? "Upload screenshot"
              : "Replace screenshot"}
            <FileInput
              type="file"
              accept="image/*"
              aria-label="1h or 4h context chart"
              onChange={(event) =>
                void handleFileChange(
                  contextTimeframe,
                  event.target.files?.[0] ?? null,
                )
              }
            />
          </FileLabel>
        </Slot>
      </SlotGrid>

      {validation.missingRequiredTimeframes.length > 0 ? (
        <MessageList aria-label="Missing required chart screenshots">
          {validation.missingRequiredTimeframes.map((timeframe) => (
            <MissingMessage key={timeframe}>
              Missing required screenshot: {timeframeLabels[timeframe]}.
            </MissingMessage>
          ))}
        </MessageList>
      ) : (
        <HelperText>Required chart screenshots are uploaded.</HelperText>
      )}

      {validation.warnings.length > 0 ? (
        <MessageList aria-label="Chart context warnings">
          {validation.warnings.map((warning) => (
            <WarningMessage key={warning}>{warning}</WarningMessage>
          ))}
        </MessageList>
      ) : null}

      <Placeholder>
        <PlaceholderTitle>AI analysis not connected yet</PlaceholderTitle>
        <HelperText>
          This foundation only collects and validates screenshots. Future
          analysis will return a typed result with{" "}
          {Object.keys(analysisPlaceholder).length} sections: extracted chart
          context, current setup evaluation, and ideal trade guidance.
        </HelperText>
      </Placeholder>
    </Panel>
  );
}
