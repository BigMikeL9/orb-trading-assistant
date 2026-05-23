import type { ChartSet, ChartSetValidation, ChartTimeframe } from "./models";

const requiredTimeframes: ChartTimeframe[] = ["15m-orb", "5m-execution"];

function hasChart(chartSet: ChartSet, timeframe: ChartTimeframe) {
  return chartSet.charts.some((chart) => chart.timeframe === timeframe);
}

export function validateChartSet(chartSet: ChartSet): ChartSetValidation {
  const missingRequiredTimeframes = requiredTimeframes.filter(
    (timeframe) => !hasChart(chartSet, timeframe),
  );
  const warnings: string[] = [];
  const hasHigherTimeframeContext =
    hasChart(chartSet, "1h-context") || hasChart(chartSet, "4h-context");

  if (!hasHigherTimeframeContext) {
    warnings.push("Add a 1h or 4h context chart for higher timeframe structure.");
  }

  if (!hasChart(chartSet, "daily")) {
    warnings.push("Daily chart is optional, but can clarify major levels.");
  }

  return {
    isValid: missingRequiredTimeframes.length === 0,
    missingRequiredTimeframes,
    warnings,
  };
}
