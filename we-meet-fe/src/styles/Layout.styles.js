import styled from "styled-components";

// 모바일 내비게이션 레이아웃
export const MobileNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  padding: 12px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

// 데스크톱 내비게이션 레이아웃
export const DesktopNav = styled.nav`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
    padding: 16px 0;
  }
`;

// 메인 컨텐츠 레이아웃
export const MainContent = styled.main`
  padding-bottom: 72px; // 모바일 하단 내비게이션 고려

  ${({ theme }) => theme.mediaQueries.md} {
    padding-bottom: 0;
  }
`;

// 사이드바 레이아웃 (데스크톱 전용)
export const SidebarLayout = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
  }
`;
