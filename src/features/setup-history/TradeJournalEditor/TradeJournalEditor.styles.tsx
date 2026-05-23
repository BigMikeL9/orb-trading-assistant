import styled from "styled-components";
import { Button } from "@/components/ui/Button";

export const Editor = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  border-top: ${({ theme }) => theme.border.default};
  padding-top: ${({ theme }) => theme.space[3]};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 760px) {
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
  min-height: 4.5rem;
  resize: vertical;
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.textPrimary};
  background: ${({ theme }) => theme.color.surfaceElevated};
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};

  &::placeholder {
    color: ${({ theme }) => theme.color.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.accent};
    outline: none;
    box-shadow: ${({ theme }) => theme.elevation.focus};
  }
`;

export const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SaveButton = styled(Button).attrs({ variant: "secondary" })`
  width: fit-content;
  min-height: 2rem;
`;
