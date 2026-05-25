import styled from "styled-components";

export const StyledPanel = styled.section`
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.color.surfaceElevated};
  box-shadow: ${({ theme }) => theme.elevation.sm};
`;
