import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Providers } from "@/app/providers";
import { SetupEntry } from "../SetupEntry";

function renderSetupEntry() {
  return render(
    <Providers>
      <SetupEntry />
    </Providers>,
  );
}

function openTab(name: string) {
  fireEvent.click(screen.getByRole("tab", { name }));
}

function openSetupReviewTab() {
  openTab("Setup Review");
}

function openHistoryTab() {
  openTab("History");
}

function fillValidSetup() {
  fireEvent.change(screen.getByLabelText("Symbol"), {
    target: { value: "SPY" },
  });
  fireEvent.change(screen.getByLabelText("Market date"), {
    target: { value: "2026-05-22" },
  });
  fireEvent.change(screen.getByLabelText(/Opening range high/), {
    target: { value: "100" },
  });
  fireEvent.change(screen.getByLabelText(/Opening range low/), {
    target: { value: "95" },
  });
  fireEvent.change(screen.getByLabelText("Entry price"), {
    target: { value: "101" },
  });
  fireEvent.change(screen.getByLabelText(/Stop price/), {
    target: { value: "98" },
  });
  fireEvent.change(screen.getByLabelText("Target price"), {
    target: { value: "108" },
  });
  fireEvent.click(screen.getByLabelText("Broke opening range"));
  fireEvent.click(screen.getByLabelText("Held retest"));
  fireEvent.click(screen.getByLabelText("Volume confirmed"));
  fireEvent.click(screen.getByLabelText("Trend aligned"));
  fireEvent.click(screen.getByLabelText("Avoided chop"));
}

describe("SetupEntry local history", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "00000000-0000-4000-8000-000000000000",
    );
  });

  it("defaults to chart review and supports keyboard tab navigation", () => {
    renderSetupEntry();

    const chartReviewTab = screen.getByRole("tab", { name: "Chart Review" });
    expect(chartReviewTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Chart Review" })).toBeVisible();

    fireEvent.keyDown(chartReviewTab, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Setup Review" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel", { name: "Setup Review" })).toBeVisible();
  });

  it("saves a setup and displays it in history", async () => {
    renderSetupEntry();
    openSetupReviewTab();
    fillValidSetup();

    fireEvent.click(
      screen.getByRole("button", { name: "Save evaluated setup" }),
    );
    openHistoryTab();

    const history = screen.getByRole("region", { name: "Setup history" });

    expect(await within(history).findByRole("table")).toBeVisible();
    expect(within(history).getByText("SPY")).toBeVisible();
    expect(within(history).getByText("long")).toBeVisible();
    expect(within(history).getByText(/2.33R/)).toBeVisible();
    expect(
      within(history).getByRole("button", {
        name: "View / Edit SPY setup",
      }),
    ).toBeVisible();
  });

  it("opens setup details in a modal", async () => {
    renderSetupEntry();
    openSetupReviewTab();
    fillValidSetup();

    fireEvent.click(
      screen.getByRole("button", { name: "Save evaluated setup" }),
    );
    openHistoryTab();
    fireEvent.click(
      await screen.findByRole("button", { name: "View / Edit SPY setup" }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Edit SPY long setup",
    });

    expect(dialog).toBeVisible();
    expect(within(dialog).getByText("2026-05-22")).toBeVisible();
    expect(within(dialog).getByText("95 - 100")).toBeVisible();
    expect(within(dialog).getByText("101 / 98 / 108")).toBeVisible();
  });

  it("closes setup details with Escape", async () => {
    renderSetupEntry();
    openSetupReviewTab();
    fillValidSetup();

    fireEvent.click(
      screen.getByRole("button", { name: "Save evaluated setup" }),
    );
    openHistoryTab();
    fireEvent.click(
      await screen.findByRole("button", { name: "View / Edit SPY setup" }),
    );

    expect(screen.getByRole("dialog")).toBeVisible();

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("reloads a saved setup into the form", async () => {
    renderSetupEntry();
    openSetupReviewTab();
    fillValidSetup();

    fireEvent.click(
      screen.getByRole("button", { name: "Save evaluated setup" }),
    );
    fireEvent.change(screen.getByLabelText("Symbol"), {
      target: { value: "QQQ" },
    });
    openHistoryTab();
    fireEvent.click(
      await screen.findByRole("button", { name: "View / Edit SPY setup" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Reload setup" }));

    expect(screen.getByLabelText("Symbol")).toHaveValue("SPY");
  });

  it("deletes a saved setup", async () => {
    renderSetupEntry();
    openSetupReviewTab();
    fillValidSetup();

    fireEvent.click(
      screen.getByRole("button", { name: "Save evaluated setup" }),
    );
    openHistoryTab();
    fireEvent.click(
      await screen.findByRole("button", { name: "View / Edit SPY setup" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete setup" }));

    await waitFor(() => {
      expect(screen.queryByText("SPY")).not.toBeInTheDocument();
    });
    expect(screen.getByText(/No saved setups yet/)).toBeVisible();
  });

  it("marks outcome and saves journal notes", async () => {
    renderSetupEntry();
    openSetupReviewTab();
    fillValidSetup();

    fireEvent.click(
      screen.getByRole("button", { name: "Save evaluated setup" }),
    );
    openHistoryTab();
    fireEvent.click(
      await screen.findByRole("button", { name: "View / Edit SPY setup" }),
    );
    fireEvent.change(await screen.findByLabelText("Journal status"), {
      target: { value: "win" },
    });
    fireEvent.change(screen.getByLabelText("Realized R"), {
      target: { value: "2.5" },
    });
    fireEvent.change(screen.getByLabelText("Mistake notes"), {
      target: { value: "Entered one candle late." },
    });
    fireEvent.change(screen.getByLabelText("Lesson learned"), {
      target: { value: "Wait for the first retest to hold." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save journal" }));

    expect((await screen.findAllByText("win"))[0]).toBeVisible();

    const savedValue = window.localStorage.getItem("orb-trading-assistant:setups");
    expect(savedValue).not.toBeNull();
    expect(JSON.parse(savedValue ?? "[]")).toEqual([
      expect.objectContaining({
        journal: expect.objectContaining({
          status: "win",
          realizedR: 2.5,
          mistakeNotes: "Entered one candle late.",
          lessonLearned: "Wait for the first retest to hold.",
        }),
      }),
    ]);
  });

  it("shows recoverable messages when local storage reads fail", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage unavailable.");
    });

    renderSetupEntry();

    openHistoryTab();
    expect(
      await screen.findByText("Saved setup history could not be loaded."),
    ).toBeVisible();
    openTab("Risk");
    expect(screen.getByText("Risk settings could not be loaded.")).toBeVisible();
    openSetupReviewTab();
    expect(screen.getByText("Pre-market bias could not be loaded.")).toBeVisible();
  });
});
