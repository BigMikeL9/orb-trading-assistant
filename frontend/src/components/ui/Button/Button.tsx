"use client";

import { StyledButton } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

export function Button({ variant = "primary", ...props }: ButtonProps) {
  return <StyledButton $variant={variant} {...props} />;
}
