"use client";

import type { KeyboardEvent } from "react";
import { useRef } from "react";
import { TabButton, TabList, TabPanel, TabsRoot } from "./DashboardTabs.styles";
import type { DashboardTabId, DashboardTabsProps } from "./DashboardTabs.types";

function getNextTabId(
  tabs: DashboardTabsProps["tabs"],
  activeTabId: DashboardTabId,
  direction: 1 | -1,
) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
  const nextIndex = (activeIndex + direction + tabs.length) % tabs.length;

  return tabs[nextIndex]?.id ?? activeTabId;
}

export function DashboardTabs({
  activeTabId,
  tabs,
  onTabChange,
}: DashboardTabsProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function focusTab(tabId: DashboardTabId) {
    tabRefs.current[tabId]?.focus();
  }

  function selectTab(tabId: DashboardTabId) {
    onTabChange(tabId);
    window.requestAnimationFrame(() => focusTab(tabId));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectTab(getNextTabId(tabs, activeTabId, 1));
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectTab(getNextTabId(tabs, activeTabId, -1));
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectTab(tabs[0]?.id ?? activeTabId);
    }

    if (event.key === "End") {
      event.preventDefault();
      selectTab(tabs[tabs.length - 1]?.id ?? activeTabId);
    }
  }

  return (
    <TabsRoot>
      <TabList role="tablist" aria-label="ORB assistant workflow">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tab.id] = element;
            }}
            id={`${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`${tab.id}-panel`}
            tabIndex={activeTabId === tab.id ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={handleKeyDown}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>

      {tabs.map((tab) => (
        <TabPanel
          key={tab.id}
          id={`${tab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
          hidden={activeTabId !== tab.id}
          tabIndex={0}
        >
          {tab.content}
        </TabPanel>
      ))}
    </TabsRoot>
  );
}
