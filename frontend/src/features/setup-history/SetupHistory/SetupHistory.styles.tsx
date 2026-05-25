import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const HistoryCard = styled(Card)`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Header = styled.header`
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

export const TableScroll = styled.div`
  overflow-x: auto;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surfaceElevated};
`;

export const Table = styled.table`
  width: 100%;
  min-width: 940px;
  border-collapse: collapse;
  text-align: left;
`;

export const TableHeaderCell = styled.th`
  border-bottom: ${({ theme }) => theme.border.default};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  letter-spacing: 0;
  white-space: nowrap;
`;

export const TableCell = styled.td`
  border-bottom: ${({ theme }) => theme.border.default};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  vertical-align: middle;
  white-space: nowrap;

  tr:last-child & {
    border-bottom: 0;
  }
`;

export const SymbolCell = styled.span`
  color: ${({ theme }) => theme.color.textPrimary};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

export const TableStatus = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

export const SecondaryButton = styled(Button).attrs({ variant: "secondary" })`
  min-height: 2rem;
`;

export const DangerButton = styled(Button).attrs({ variant: "danger" })`
  min-height: 2rem;
`;

export const DetailGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};
  margin: ${({ theme }) => theme.space[4]} 0;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surfaceElevated};
`;

export const DetailLabel = styled.dt`
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

export const DetailValue = styled.dd`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

export const ModalActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[4]};
`;
