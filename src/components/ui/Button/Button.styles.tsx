import styled, { css } from "styled-components";
import type { StyledButtonProps } from "./Button.types";

const buttonVariant = {
  primary: css`
    border-color: transparent;
    color: ${({ theme }) => theme.color.textPrimary};
    background: ${({ theme }) => theme.color.accent};

    &:hover {
      background: ${({ theme }) => theme.color.accentHover};
    }
  `,
  secondary: css`
    border-color: ${({ theme }) => theme.color.borderStrong};
    color: ${({ theme }) => theme.color.textPrimary};
    background: ${({ theme }) => theme.color.surfaceElevated};

    &:hover {
      border-color: ${({ theme }) => theme.color.textMuted};
      background: ${({ theme }) => theme.color.surfaceMuted};
    }
  `,
  ghost: css`
    border-color: transparent;
    color: ${({ theme }) => theme.color.textSecondary};
    background: transparent;

    &:hover {
      color: ${({ theme }) => theme.color.textPrimary};
      background: ${({ theme }) => theme.color.surfaceMuted};
    }
  `,
  danger: css`
    border-color: ${({ theme }) => theme.color.dangerMuted};
    color: ${({ theme }) => theme.color.danger};
    background: ${({ theme }) => theme.color.dangerMuted};

    &:hover {
      border-color: ${({ theme }) => theme.color.danger};
      background: ${({ theme }) => theme.color.dangerMuted};
    }
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  min-height: 2.25rem;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0 ${({ theme }) => theme.space[3]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  transition:
    background 140ms ease,
    border-color 140ms ease,
    color 140ms ease,
    box-shadow 140ms ease;

  ${({ $variant }) => buttonVariant[$variant]}

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.elevation.focus};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    pointer-events: none;
  }
`;
