import styled from "styled-components";

export const StyledCard = styled.section`
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.elevation.sm};
`;
