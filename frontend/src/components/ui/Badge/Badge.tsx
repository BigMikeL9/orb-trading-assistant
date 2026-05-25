"use client";

import { StyledBadge } from "./Badge.styles";
import type { BadgeProps } from "./Badge.types";

export function Badge({ tone = "neutral", ...props }: BadgeProps) {
  return <StyledBadge $tone={tone} {...props} />;
}
