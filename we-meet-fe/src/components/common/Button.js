import styled from "styled-components";
import css from "styled-components";

export const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: ${({ theme, variant }) =>
    variant === "outlined" || variant === "text"
      ? "transparent"
      : theme.colors.primary};
  border: ${({ theme, variant }) =>
    variant === "outlined" ? `1px solid ${theme.colors.primary}` : "none"};
  color: ${({ theme, variant }) =>
    variant === "outlined" || variant === "text"
      ? theme.colors.primary
      : theme.colors.white};

  ${({ variant }) => {
    switch (variant) {
      case "outlined":
        return css`
          &:hover {
            background: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.white};
          }
        `;
      case "text":
        return css`
          background: transparent;
          border: none;
          color: ${({ theme }) => theme.colors.primary};
          padding: 8px;

          &:hover {
            background: ${({ theme }) => theme.colors.gray[100]};
          }
        `;
      default:
        return css`
          background: ${({ theme }) => theme.colors.primary};
          border: none;
          color: ${({ theme }) => theme.colors.white};

          &:hover {
            background: ${({ theme }) => theme.colors.secondary};
          }
        `;
    }
  }}

  ${({ size }) => {
    switch (size) {
      case "small":
        return css`
          padding: 4px 12px;
          font-size: 12px;
        `;
      case "large":
        return css`
          padding: 12px 24px;
          font-size: 16px;
        `;
      default:
        return css`
          padding: 8px 16px;
          font-size: 14px;
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
