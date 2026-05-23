import styled from "styled-components";

export const TabsRoot = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

export const TabList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[1]};
  overflow-x: auto;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[1]};
  background: ${({ theme }) => theme.color.surfaceElevated};
`;

export const TabButton = styled.button`
  min-height: 2.25rem;
  flex: 0 0 auto;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0 ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textSecondary};
  background: transparent;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;

  &[aria-selected="true"] {
    color: ${({ theme }) => theme.color.textPrimary};
    background: ${({ theme }) => theme.color.surfaceMuted};
  }

  &:hover {
    color: ${({ theme }) => theme.color.textPrimary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.elevation.focus};
  }
`;

export const TabPanel = styled.div`
  &:focus {
    outline: none;
  }
`;
