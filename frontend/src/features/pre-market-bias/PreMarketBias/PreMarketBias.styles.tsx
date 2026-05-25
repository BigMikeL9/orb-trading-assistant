import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const Panel = styled(Card)`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Select = styled.select`
  width: 100%;
  min-height: 2.25rem;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0 ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textPrimary};
  background: ${({ theme }) => theme.color.surfaceElevated};
  font-size: ${({ theme }) => theme.typography.size.sm};

  &:focus {
    border-color: ${({ theme }) => theme.color.accent};
    outline: none;
    box-shadow: ${({ theme }) => theme.elevation.focus};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 4rem;
  resize: vertical;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textPrimary};
  background: ${({ theme }) => theme.color.surfaceElevated};
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};

  &:focus {
    border-color: ${({ theme }) => theme.color.accent};
    outline: none;
    box-shadow: ${({ theme }) => theme.elevation.focus};
  }
`;

export const CheckboxList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
`;

export const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: ${({ theme }) => theme.color.accent};
`;

export const Output = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surfaceElevated};
`;

export const OutputTitle = styled.h3`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  padding-left: ${({ theme }) => theme.space[5]};
`;

export const ListItem = styled.li`
  color: ${({ theme }) => theme.color.textMuted};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

export const SaveButton = styled(Button).attrs({ variant: "secondary" })`
  width: fit-content;
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.color.danger};
`;
