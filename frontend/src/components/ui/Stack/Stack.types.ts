import type { ComponentPropsWithoutRef } from "react";

export type StackProps = ComponentPropsWithoutRef<"div"> & {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
};

export type StyledStackProps = {
  $gap: NonNullable<StackProps["gap"]>;
};
