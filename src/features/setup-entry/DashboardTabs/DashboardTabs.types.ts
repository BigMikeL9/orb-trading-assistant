import type { ReactNode } from "react";

export type DashboardTabId = "chart-review" | "setup-review" | "risk" | "history";

export type DashboardTab = {
  id: DashboardTabId;
  label: string;
  content: ReactNode;
};

export type DashboardTabsProps = {
  activeTabId: DashboardTabId;
  tabs: DashboardTab[];
  onTabChange: (tabId: DashboardTabId) => void;
};
