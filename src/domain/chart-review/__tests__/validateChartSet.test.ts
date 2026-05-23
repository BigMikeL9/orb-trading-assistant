import { describe, expect, it } from "vitest";
import type { ChartImage, ChartSet, ChartTimeframe } from "../models";
import { validateChartSet } from "../validateChartSet";

function chart(timeframe: ChartTimeframe): ChartImage {
  return {
    id: timeframe,
    timeframe,
    fileName: `${timeframe}.png`,
    mimeType: "image/png",
    sizeBytes: 128,
    dataUrl: "data:image/png;base64,test",
    uploadedAt: "2026-05-22T12:00:00.000Z",
  };
}

function chartSet(charts: ChartImage[]): ChartSet {
  return {
    id: "chart-set-1",
    symbol: "SPY",
    marketDate: "2026-05-22",
    charts,
    createdAt: "2026-05-22T12:00:00.000Z",
    updatedAt: "2026-05-22T12:00:00.000Z",
  };
}

describe("validateChartSet", () => {
  it("validates required 15m and 5m screenshots", () => {
    const validation = validateChartSet(
      chartSet([
        chart("15m-orb"),
        chart("5m-execution"),
        chart("1h-context"),
        chart("daily"),
      ]),
    );

    expect(validation.isValid).toBe(true);
    expect(validation.missingRequiredTimeframes).toHaveLength(0);
  });

  it("requires the 15m ORB chart", () => {
    const validation = validateChartSet(chartSet([chart("5m-execution")]));

    expect(validation.isValid).toBe(false);
    expect(validation.missingRequiredTimeframes).toContain("15m-orb");
  });

  it("requires the 5m execution chart", () => {
    const validation = validateChartSet(chartSet([chart("15m-orb")]));

    expect(validation.isValid).toBe(false);
    expect(validation.missingRequiredTimeframes).toContain("5m-execution");
  });

  it("warns when higher timeframe context is missing", () => {
    const validation = validateChartSet(
      chartSet([chart("15m-orb"), chart("5m-execution"), chart("daily")]),
    );

    expect(validation.warnings).toContain(
      "Add a 1h or 4h context chart for higher timeframe structure.",
    );
  });

  it("warns when the daily chart is missing", () => {
    const validation = validateChartSet(
      chartSet([chart("15m-orb"), chart("5m-execution"), chart("4h-context")]),
    );

    expect(validation.warnings).toContain(
      "Daily chart is optional, but can clarify major levels.",
    );
  });
});
