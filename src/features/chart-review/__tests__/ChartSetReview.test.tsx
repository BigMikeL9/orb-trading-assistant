import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Providers } from "@/app/providers";
import { ChartSetReview } from "../ChartSetReview";

function renderChartSetReview() {
  return render(
    <Providers>
      <ChartSetReview createId={() => "chart-1"} />
    </Providers>,
  );
}

function chartFile(fileName: string) {
  return new File(["chart"], fileName, { type: "image/png" });
}

describe("ChartSetReview", () => {
  it("shows missing required screenshot messages", () => {
    renderChartSetReview();

    expect(
      screen.getByText("Missing required screenshot: 15m ORB chart."),
    ).toBeVisible();
    expect(
      screen.getByText("Missing required screenshot: 5m execution chart."),
    ).toBeVisible();
    expect(screen.getByText("AI analysis not connected yet")).toBeVisible();
  });

  it("uploads required screenshots and shows previews", async () => {
    renderChartSetReview();

    fireEvent.change(screen.getByLabelText("15m ORB chart"), {
      target: { files: [chartFile("orb.png")] },
    });
    fireEvent.change(screen.getByLabelText("5m execution chart"), {
      target: { files: [chartFile("execution.png")] },
    });

    expect(await screen.findByAltText("15m ORB chart preview")).toBeVisible();
    expect(await screen.findByAltText("5m execution chart preview")).toBeVisible();
    expect(
      screen.queryByText("Missing required screenshot: 15m ORB chart."),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Required chart screenshots are uploaded.")).toBeVisible();
  });

  it("removes an uploaded screenshot and restores missing state", async () => {
    renderChartSetReview();

    fireEvent.change(screen.getByLabelText("15m ORB chart"), {
      target: { files: [chartFile("orb.png")] },
    });

    expect(await screen.findByAltText("15m ORB chart preview")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Remove screenshot" }));

    await waitFor(() => {
      expect(
        screen.queryByAltText("15m ORB chart preview"),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByText("Missing required screenshot: 15m ORB chart."),
    ).toBeVisible();
  });

  it("uploads an optional context screenshot", async () => {
    renderChartSetReview();

    fireEvent.change(screen.getByLabelText("Context chart timeframe"), {
      target: { value: "4h-context" },
    });
    fireEvent.change(screen.getByLabelText("1h or 4h context chart"), {
      target: { files: [chartFile("context.png")] },
    });

    expect(await screen.findByAltText("4h context chart preview")).toBeVisible();
    expect(screen.getByText(/context.png/)).toBeVisible();
  });
});
