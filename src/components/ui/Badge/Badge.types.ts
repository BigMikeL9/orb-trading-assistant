import type { ComponentPropsWithoutRef } from "react";

export type BadgeTone = "neutral" | "pass" | "warning" | "fail";

export type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: BadgeTone;
};

export type StyledBadgeProps = {
  $tone?: BadgeTone;
};
