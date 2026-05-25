import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const FormCard = styled(Card)`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

export const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

export const SectionDescription = styled.p`
  color: ${({ theme }) => theme.color.textMuted};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 640px) {
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
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.borderStrong};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.accent};
    outline: none;
    box-shadow: ${({ theme }) => theme.elevation.focus};
  }
`;

export const CheckboxList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
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

export const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

export const SaveButton = styled(Button)`
  width: fit-content;
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.color.danger};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
