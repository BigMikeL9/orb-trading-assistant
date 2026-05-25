import styled from "styled-components";
import { Button } from "@/components/ui/Button";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.space[4]};
  background: rgb(0 0 0 / 0.58);
`;

export const Dialog = styled.div`
  width: min(860px, 100%);
  max-height: min(86vh, 860px);
  overflow: auto;
  border: ${({ theme }) => theme.border.strong};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.elevation.md};

  &:focus {
    outline: none;
  }
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  border-bottom: ${({ theme }) => theme.border.default};
  padding: ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.color.surface};
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

export const CloseButton = styled(Button).attrs({ variant: "ghost" })`
  min-height: 2rem;
`;

export const Body = styled.div`
  padding: ${({ theme }) => theme.space[4]};
`;
