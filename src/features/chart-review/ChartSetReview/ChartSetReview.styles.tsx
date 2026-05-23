import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const Panel = styled(Card)`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 640px) {
    display: grid;
  }
`;

export const TitleGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

export const HelperText = styled.p`
  color: ${({ theme }) => theme.color.textMuted};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Slot = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surfaceElevated};
`;

export const SlotHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

export const SlotTitle = styled.h3`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

export const FileLabel = styled.label`
  display: inline-flex;
  width: fit-content;
  min-height: 2.25rem;
  align-items: center;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0 ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textPrimary};
  background: ${({ theme }) => theme.color.surface};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};

  &:focus-within {
    box-shadow: ${({ theme }) => theme.elevation.focus};
  }
`;

export const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export const Preview = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const PreviewImage = styled.img`
  width: 100%;
  max-height: 260px;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  object-fit: contain;
  background: ${({ theme }) => theme.color.background};
`;

export const PreviewMeta = styled.span`
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

export const RemoveButton = styled(Button).attrs({ variant: "ghost" })`
  width: fit-content;
`;

export const ContextSelect = styled.select`
  width: fit-content;
  min-height: 2.25rem;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0 ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textPrimary};
  background: ${({ theme }) => theme.color.surface};
`;

export const MessageList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  padding-left: ${({ theme }) => theme.space[5]};
`;

export const MissingMessage = styled.li`
  color: ${({ theme }) => theme.color.danger};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

export const WarningMessage = styled.li`
  color: ${({ theme }) => theme.color.warning};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

export const Placeholder = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surfaceMuted};
`;

export const PlaceholderTitle = styled.h3`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
