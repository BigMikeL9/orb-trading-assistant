import type { ChartImage, ChartTimeframe } from "@/domain/chart-review/models";

export type ChartSlot = {
  label: string;
  timeframe: ChartTimeframe;
  requirement: "required" | "optional";
  helperText: string;
};

export type ChartSetReviewProps = {
  createId?: () => string;
};

export type UploadedCharts = Partial<Record<ChartTimeframe, ChartImage>>;
