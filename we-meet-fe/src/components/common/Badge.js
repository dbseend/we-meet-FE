import styled from "styled-components";

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  ${({ variant }) => {
    switch (variant) {
      case "success":
        return css`
          background-color: #def7ec;
          color: #03543f;
        `;
      case "error":
        return css`
          background-color: #fde2e2;
          color: #9b1c1c;
        `;
      case "warning":
        return css`
          background-color: #fdf6b2;
          color: #723b13;
        `;
      default:
        return css`
          background-color: ${({ theme }) => theme.colors.gray[200]};
          color: ${({ theme }) => theme.colors.gray[700]};
        `;
    }
  }}
`;
