import type { TradeJournal } from "@/domain/orb/models";
import type { SavedSetup, SetupStorage } from "./setupStorage.types";

const STORAGE_KEY = "orb-trading-assistant:setups";
const defaultJournal = {
  status: "planned",
} as const;
const journalStatuses = new Set([
  "planned",
  "taken",
  "skipped",
  "win",
  "loss",
  "breakeven",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSavedSetup(value: unknown): value is SavedSetup {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.savedAt === "string" &&
    isRecord(value.draft) &&
    isRecord(value.evaluation)
  );
}

function isTradeJournal(value: unknown): value is TradeJournal {
  return (
    isRecord(value) &&
    typeof value.status === "string" &&
    journalStatuses.has(value.status)
  );
}

function normalizeSavedSetup(setup: SavedSetup): SavedSetup {
  return {
    ...setup,
    journal: isTradeJournal(setup.journal) ? setup.journal : defaultJournal,
  };
}

function readRawSetups(storage: SetupStorage): SavedSetup[] {
  const rawValue = storage.getItem(STORAGE_KEY);

  if (rawValue === null) {
    return [];
  }

  const parsedValue: unknown = JSON.parse(rawValue);

  if (!Array.isArray(parsedValue)) {
    throw new Error("Saved setup history is not a list.");
  }

  if (!parsedValue.every(isSavedSetup)) {
    throw new Error("Saved setup history contains invalid setup data.");
  }

  return parsedValue.map(normalizeSavedSetup);
}

function writeRawSetups(storage: SetupStorage, setups: SavedSetup[]) {
  storage.setItem(STORAGE_KEY, JSON.stringify(setups));
}

export function getSavedSetups(storage: SetupStorage): SavedSetup[] {
  return readRawSetups(storage);
}

export function saveSetup(
  storage: SetupStorage,
  setup: Omit<SavedSetup, "id" | "savedAt" | "journal"> &
    Partial<Pick<SavedSetup, "journal">>,
  now = new Date(),
  createId = () => crypto.randomUUID(),
): SavedSetup {
  const savedSetup: SavedSetup = {
    ...setup,
    id: createId(),
    savedAt: now.toISOString(),
    journal: setup.journal ?? defaultJournal,
  };

  const savedSetups = readRawSetups(storage);
  writeRawSetups(storage, [savedSetup, ...savedSetups]);

  return savedSetup;
}

export function deleteSavedSetup(storage: SetupStorage, setupId: string) {
  const savedSetups = readRawSetups(storage);
  writeRawSetups(
    storage,
    savedSetups.filter((setup) => setup.id !== setupId),
  );
}

export function updateSavedSetupJournal(
  storage: SetupStorage,
  setupId: string,
  journal: SavedSetup["journal"],
): SavedSetup | null {
  const savedSetups = readRawSetups(storage);
  let updatedSetup: SavedSetup | null = null;

  const updatedSetups = savedSetups.map((setup) => {
    if (setup.id !== setupId) {
      return setup;
    }

    updatedSetup = {
      ...setup,
      journal,
    };

    return updatedSetup;
  });

  writeRawSetups(storage, updatedSetups);

  return updatedSetup;
}

export function clearSavedSetups(storage: SetupStorage) {
  storage.removeItem(STORAGE_KEY);
}
