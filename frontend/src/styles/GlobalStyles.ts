"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html {
    height: 100%;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.color.textPrimary};
    background: ${({ theme }) => theme.color.background};
    font-family: ${({ theme }) => theme.font.sans};
    font-size: ${({ theme }) => theme.typography.size.md};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    color: ${({ theme }) => theme.color.textPrimary};
    background: ${({ theme }) => theme.color.accentMuted};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    letter-spacing: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
