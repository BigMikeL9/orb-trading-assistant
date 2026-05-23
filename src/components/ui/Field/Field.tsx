"use client";

import { StyledField, StyledFieldHint } from "./Field.styles";
import type { FieldHintProps, FieldProps } from "./Field.types";

export function Field(props: FieldProps) {
  return <StyledField {...props} />;
}

export function FieldHint(props: FieldHintProps) {
  return <StyledFieldHint {...props} />;
}
