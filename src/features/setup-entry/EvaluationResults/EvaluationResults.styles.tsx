import styled from "styled-components";
import { Card } from "@/components/ui/Card";

export const ResultsCard = styled(Card)`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

export const Metric = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surfaceMuted};
`;

export const ContextSummary = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surfaceElevated};
`;

export const ContextHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

export const MetricLabel = styled.span`
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-transform: uppercase;
`;

export const MetricValue = styled.strong`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size["2xl"]};
`;

export const VerdictMessage = styled.p`
  color: ${({ theme }) => theme.color.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

export const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.color.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
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

export const EmptyText = styled.p`
  color: ${({ theme }) => theme.color.textMuted};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
