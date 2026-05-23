import type { RiskRewardInput, RiskRewardResult } from "./models";

const isPositivePrice = (price: number) => Number.isFinite(price) && price > 0;

export function calculateRiskReward(input: RiskRewardInput): RiskRewardResult {
  const { direction, entryPrice, stopPrice, targetPrice } = input;

  if (
    !isPositivePrice(entryPrice) ||
    !isPositivePrice(stopPrice) ||
    !isPositivePrice(targetPrice)
  ) {
    return {
      riskPerShare: 0,
      rewardPerShare: 0,
      ratio: null,
      isValid: false,
    };
  }

  const riskPerShare =
    direction === "long" ? entryPrice - stopPrice : stopPrice - entryPrice;
  const rewardPerShare =
    direction === "long" ? targetPrice - entryPrice : entryPrice - targetPrice;

  if (riskPerShare <= 0 || rewardPerShare <= 0) {
    return {
      riskPerShare,
      rewardPerShare,
      ratio: null,
      isValid: false,
    };
  }

  return {
    riskPerShare,
    rewardPerShare,
    ratio: rewardPerShare / riskPerShare,
    isValid: true,
  };
}
