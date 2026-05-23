import styled from "styled-components";

export const Summary = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surfaceElevated};
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-transform: uppercase;
`;

export const Value = styled.strong`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const WideMetricCard = styled(MetricCard)`
  grid-column: 1 / -1;
`;
