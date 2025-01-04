import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction || "column"};
  justify-content: ${({ justify }) => justify || "center"};
  align-items: ${({ align }) => align || "center"};
  gap: ${({ gap }) => gap || "16px"};

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: ${({ desktopDirection }) => desktopDirection || "row"};
    gap: ${({ desktopGap }) => desktopGap || "24px"};
  }
`;
