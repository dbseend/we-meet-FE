import styled from "styled-components";

export const Heading = styled.h1`
  font-size: ${({ level }) => {
    switch (level) {
      case 1:
        return "24px";
      case 2:
        return "20px";
      case 3:
        return "18px";
      default:
        return "16px";
    }
  }};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: ${({ level }) => {
      switch (level) {
        case 1:
          return "32px";
        case 2:
          return "24px";
        case 3:
          return "20px";
        default:
          return "18px";
      }
    }};
  }
`;

export const Text = styled.p`
  font-size: 14px;
  line-height: 1.5;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`;
