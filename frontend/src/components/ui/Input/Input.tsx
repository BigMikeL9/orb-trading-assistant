"use client";

import { StyledInput } from "./Input.styles";
import type { InputProps } from "./Input.types";

export function Input(props: InputProps) {
  return <StyledInput {...props} />;
}
