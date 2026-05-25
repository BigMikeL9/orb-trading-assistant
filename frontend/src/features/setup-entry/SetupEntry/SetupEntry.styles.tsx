import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
`;

export const Header = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: ${({ theme }) => theme.typography.size["3xl"]};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const Description = styled.p`
  max-width: 720px;
  color: ${({ theme }) => theme.color.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: ${({ theme }) => theme.space[5]};
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

export const SideColumn = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;
