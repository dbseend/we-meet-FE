import styled from "styled-components";

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: ${({ padding }) => padding || "16px"};

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-2px);
      }
    `}
`;
