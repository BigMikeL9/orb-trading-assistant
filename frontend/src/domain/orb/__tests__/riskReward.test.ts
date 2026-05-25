import { describe, expect, it } from "vitest";
import { calculateRiskReward } from "../riskReward";

describe("calculateRiskReward", () => {
  it("calculates risk and reward for a long setup", () => {
    expect(
      calculateRiskReward({
        direction: "long",
        entryPrice: 105,
        stopPrice: 100,
        targetPrice: 120,
      }),
    ).toEqual({
      riskPerShare: 5,
      rewardPerShare: 15,
      ratio: 3,
      isValid: true,
    });
  });

  it("calculates risk and reward for a short setup", () => {
    expect(
      calculateRiskReward({
        direction: "short",
        entryPrice: 95,
        stopPrice: 100,
        targetPrice: 80,
      }),
    ).toEqual({
      riskPerShare: 5,
      rewardPerShare: 15,
      ratio: 3,
      isValid: true,
    });
  });

  it("rejects invalid prices", () => {
    expect(
      calculateRiskReward({
        direction: "long",
        entryPrice: 0,
        stopPrice: 100,
        targetPrice: 120,
      }),
    ).toEqual({
      riskPerShare: 0,
      rewardPerShare: 0,
      ratio: null,
      isValid: false,
    });
  });

  it("rejects zero risk", () => {
    expect(
      calculateRiskReward({
        direction: "long",
        entryPrice: 100,
        stopPrice: 100,
        targetPrice: 120,
      }),
    ).toEqual({
      riskPerShare: 0,
      rewardPerShare: 20,
      ratio: null,
      isValid: false,
    });
  });
});
