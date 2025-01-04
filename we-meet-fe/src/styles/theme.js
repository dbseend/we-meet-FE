export const theme = {
  colors: {
    primary: "#4F46E5",
    secondary: "#8B5CF6",
    background: "#F3F4F6",
    white: "#FFFFFF",
    gray: {
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
    },
  },
  // 모바일 퍼스트를 위한 미디어쿼리 브레이크포인트
  mediaQueries: {
    sm: `@media screen and (min-width: 480px)`,
    md: `@media screen and (min-width: 768px)`,
    lg: `@media screen and (min-width: 1024px)`,
    xl: `@media screen and (min-width: 1280px)`,
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
};
