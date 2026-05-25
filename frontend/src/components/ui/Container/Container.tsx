"use client";

import { StyledContainer } from "./Container.styles";
import type { ContainerProps } from "./Container.types";

export function Container(props: ContainerProps) {
  return <StyledContainer {...props} />;
}
