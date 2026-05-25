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

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Metric = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surfaceElevated};
`;

export const MetricLabel = styled.span`
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-transform: uppercase;
`;

export const MetricValue = styled.strong`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SaveButton = styled(Button).attrs({ variant: "secondary" })`
  width: fit-content;
`;

export const ReasonsList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  padding-left: ${({ theme }) => theme.space[5]};
`;

export const Reason = styled.li`
  color: ${({ theme }) => theme.color.warning};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.color.danger};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
