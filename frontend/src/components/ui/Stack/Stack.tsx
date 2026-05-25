"use client";

import { StyledStack } from "./Stack.styles";
import type { StackProps } from "./Stack.types";

export function Stack({ gap = 4, ...props }: StackProps) {
  return <StyledStack $gap={gap} {...props} />;
}
