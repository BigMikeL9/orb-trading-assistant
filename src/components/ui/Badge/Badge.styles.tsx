import styled, { css } from "styled-components";
import type { StyledBadgeProps } from "./Badge.types";

const badgeTone = {
  neutral: css`
    color: ${({ theme }) => theme.color.textMuted};
    background: ${({ theme }) => theme.color.surfaceMuted};
  `,
  pass: css`
    color: ${({ theme }) => theme.color.success};
    background: ${({ theme }) => theme.color.successMuted};
  `,
  warning: css`
    color: ${({ theme }) => theme.color.warning};
    background: ${({ theme }) => theme.color.warningMuted};
  `,
  fail: css`
    color: ${({ theme }) => theme.color.danger};
    background: ${({ theme }) => theme.color.dangerMuted};
  `,
};

export const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  min-height: 1.375rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 0 ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  ${({ $tone = "neutral" }) => badgeTone[$tone]}
`;
