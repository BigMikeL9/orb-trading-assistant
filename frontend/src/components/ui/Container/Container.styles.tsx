import styled from "styled-components";

export const StyledContainer = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding-inline: ${({ theme }) => theme.space[4]};
`;
