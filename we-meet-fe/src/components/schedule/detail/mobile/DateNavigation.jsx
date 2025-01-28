import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";

const DateNavigation = ({
  dates,
  currentDateIndex,
  setCurrentDateIndex,
  MAX_DAYS_SHOWN,
}) => {

  const canNavigatePrev = currentDateIndex > 0; // 이전 페이지로 이동 가능한지 확인
  const canNavigateNext = dates ? (currentDateIndex + 1) * MAX_DAYS_SHOWN < dates.length : false; // 다음 페이지로 이동 가능한지 확인


  // 날짜 페이지 이동 핸들러
  const handleDateNavigation = (direction) => {
    setCurrentDateIndex((prev) => {
      const maxIndex = Math.ceil(dates.length / MAX_DAYS_SHOWN) - 1;
      if (direction === "next") {
        return Math.min(prev + 1, maxIndex);
      }
      return Math.max(prev - 1, 0);
    });
  };

  return (
    <Navigation>
      <NavButton
        onClick={() => handleDateNavigation("prev")}
        disabled={!canNavigatePrev}
      >
        <ChevronLeft size={24} />
      </NavButton>
      {/* <DateDisplay>
          {visibleDates[0]} ~ {visibleDates[visibleDates.length - 1]}
        </DateDisplay> */}
      <NavButton
        onClick={() => handleDateNavigation("next")}
        disabled={!canNavigateNext}
      >
        <ChevronRight size={24} />
      </NavButton>
    </Navigation>
  );
};

const Navigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DateDisplay = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  flex: 1;
  text-align: center;
  min-width: 0;
  padding: 0 0.5rem;
`;

const NavButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${(props) => (props.disabled ? "#ccc" : "#333")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px; // 최소 터치 영역 확보

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "scale(0.95)")};
  }
`;

export default DateNavigation;
