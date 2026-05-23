"use client";

import { StyledPanel } from "./Panel.styles";
import type { PanelProps } from "./Panel.types";

export function Panel(props: PanelProps) {
  return <StyledPanel {...props} />;
}
