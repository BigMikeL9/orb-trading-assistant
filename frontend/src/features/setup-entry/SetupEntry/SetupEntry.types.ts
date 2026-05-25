import type { SetupConfirmations, TradeDirection } from "@/domain/orb/models";

export type SetupDraft = {
  symbol: string;
  marketDate: string;
  openingRangeHigh: string;
  openingRangeLow: string;
  direction: TradeDirection;
  entryPrice: string;
  stopPrice: string;
  targetPrice: string;
  confirmations: SetupConfirmations;
};
