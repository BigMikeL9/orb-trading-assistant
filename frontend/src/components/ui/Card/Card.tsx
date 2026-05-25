"use client";

import { StyledCard } from "./Card.styles";
import type { CardProps } from "./Card.types";

export function Card(props: CardProps) {
  return <StyledCard {...props} />;
}
