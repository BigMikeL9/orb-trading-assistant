import styled from "styled-components";

export const StyledInput = styled.input`
  width: 100%;
  min-height: 2.25rem;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0 ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textPrimary};
  background: ${({ theme }) => theme.color.surfaceElevated};
  font-size: ${({ theme }) => theme.typography.size.sm};
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.color.textMuted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.borderStrong};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.accent};
    outline: none;
    box-shadow: ${({ theme }) => theme.elevation.focus};
  }

  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.color.danger};
  }
`;
