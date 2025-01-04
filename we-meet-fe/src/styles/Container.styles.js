import styled from "styled-components";

// 전체 페이지 컨테이너
export const PageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

// 최대 너비 제한 컨테이너
export const MaxWidthContainer = styled.div`
  max-width: ${({ maxWidth }) => maxWidth || "1200px"};
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
`;

// 섹션 컨테이너
export const SectionContainer = styled.section`
  padding: ${({ padding }) => padding || "40px 0"};
  width: 100%;
`;

// 컨텐츠 래퍼
export const ContentWrapper = styled.div`
  padding: ${({ padding }) => padding || "24px"};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
