import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  gap: ${({ gap }) => gap || "16px"};
  grid-template-columns: repeat(${({ mobileCols }) => mobileCols || 1}, 1fr);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(${({ tabletCols }) => tabletCols || 2}, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    gap: ${({ gap }) => gap || "24px"};
    grid-template-columns: repeat(
      ${({ desktopCols }) => desktopCols || 3},
      1fr
    );
  }
`;

export const GridItem = styled.div`
  grid-column: span ${({ mobileSpan }) => mobileSpan || 1};

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column: span ${({ desktopSpan }) => desktopSpan || 1};
  }
`;
