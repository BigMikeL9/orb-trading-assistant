import { beforeEach, describe, expect, it } from "vitest";
import type { SavedSetup, SetupStorage } from "../setupStorage.types";
import {
  clearSavedSetups,
  deleteSavedSetup,
  getSavedSetups,
  saveSetup,
  updateSavedSetupJournal,
} from "../setupStorage";

function createMemoryStorage(): SetupStorage {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

const savedSetupInput: Omit<SavedSetup, "id" | "savedAt"> = {
  draft: {
    symbol: "SPY",
    marketDate: "2026-05-22",
    openingRangeHigh: "100",
    openingRangeLow: "95",
    direction: "long",
    entryPrice: "101",
    stopPrice: "98",
    targetPrice: "108",
    confirmations: {
      brokeOpeningRange: true,
      heldRetest: true,
      volumeConfirmed: true,
      trendAligned: true,
      avoidedChop: true,
    },
  },
  evaluation: {
    verdict: "valid",
    passedRules: [],
    failedRules: [],
    warnings: [],
    noTradeReasons: [],
    riskReward: {
      riskPerShare: 3,
      rewardPerShare: 7,
      ratio: 7 / 3,
      isValid: true,
    },
  },
  journal: {
    status: "planned",
  },
};

describe("setupStorage", () => {
  let storage: SetupStorage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it("returns an empty list when no setups are saved", () => {
    expect(getSavedSetups(storage)).toEqual([]);
  });

  it("throws when saved setup history contains invalid data", () => {
    storage.setItem("orb-trading-assistant:setups", JSON.stringify([null]));

    expect(() => getSavedSetups(storage)).toThrow(
      "Saved setup history contains invalid setup data.",
    );
  });

  it("saves setups newest first", () => {
    const first = saveSetup(
      storage,
      savedSetupInput,
      new Date("2026-05-22T13:30:00.000Z"),
      () => "setup-1",
    );
    const second = saveSetup(
      storage,
      savedSetupInput,
      new Date("2026-05-22T13:31:00.000Z"),
      () => "setup-2",
    );

    expect(getSavedSetups(storage)).toEqual([second, first]);
  });

  it("updates journal details for a saved setup", () => {
    saveSetup(storage, savedSetupInput, new Date("2026-05-22"), () => "setup-1");

    const updatedSetup = updateSavedSetupJournal(storage, "setup-1", {
      status: "win",
      actualEntry: 101.25,
      actualExit: 108.5,
      realizedR: 2.4,
      mistakeNotes: "Chased the fill by a few cents.",
      lessonLearned: "Wait for the retest confirmation.",
    });

    expect(updatedSetup).toEqual(
      expect.objectContaining({
        id: "setup-1",
        journal: {
          status: "win",
          actualEntry: 101.25,
          actualExit: 108.5,
          realizedR: 2.4,
          mistakeNotes: "Chased the fill by a few cents.",
          lessonLearned: "Wait for the retest confirmation.",
        },
      }),
    );
    expect(getSavedSetups(storage)[0]?.journal.status).toBe("win");
  });

  it("returns null when updating a missing journal", () => {
    expect(
      updateSavedSetupJournal(storage, "missing-setup", { status: "loss" }),
    ).toBeNull();
  });

  it("deletes a saved setup", () => {
    saveSetup(storage, savedSetupInput, new Date("2026-05-22"), () => "setup-1");
    saveSetup(storage, savedSetupInput, new Date("2026-05-23"), () => "setup-2");

    deleteSavedSetup(storage, "setup-1");

    expect(getSavedSetups(storage)).toEqual([
      expect.objectContaining({ id: "setup-2" }),
    ]);
  });

  it("clears saved setups", () => {
    saveSetup(storage, savedSetupInput, new Date("2026-05-22"), () => "setup-1");

    clearSavedSetups(storage);

    expect(getSavedSetups(storage)).toEqual([]);
  });
});
