"use client";

import { StyledSection } from "./Section.styles";
import type { SectionProps } from "./Section.types";

export function Section(props: SectionProps) {
  return <StyledSection {...props} />;
}
