import styled from "styled-components";
import type { StyledStackProps } from "./Stack.types";

export const StyledStack = styled.div<StyledStackProps>`
  display: grid;
  gap: ${({ theme, $gap }) => theme.space[$gap]};
`;
