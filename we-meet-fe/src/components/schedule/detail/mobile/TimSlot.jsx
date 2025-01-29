import { useEffect } from "react";
import styled from "styled-components";

const TimeSlot = ({
  isSelected,
  availableUsers = [],
  event = null,
}) => {

  const userCount = availableUsers.length;

  // 시간대별 참여 가능 인원에 따른 배경색 결정
  const getBackgroundColor = () => {
    if (isSelected) return "#4b9bff"; // 내가 선택한 시간
    if (userCount === 0) return event ? "#f8f9fa" : "white"; // 이벤트가 있는 경우 연한 회색 배경

    // 참여 가능 인원이 많을수록 진한 색상 표시
    const intensity = Math.min(255, 255 - userCount * 30);
    return `rgb(255, ${intensity}, 0)`;
  };

  // 툴팁 내용 생성
  const getTooltipContent = () => {
    const parts = [];
    if (userCount > 0) {
      parts.push(
        `참여 가능: ${availableUsers.map((user) => user.name).join(", ")}`
      );
    }
    if (event) {
      parts.push(`일정: ${event.summary}`);
    }
    return parts.join("\n");
  };

  return (
    <StyledTimeSlot
      backgroundColor={getBackgroundColor()}
      isSelected={isSelected}
      $hasEvent={!!event}
      $eventColor={event?.calendarInfo?.color}
    >
      {(userCount > 0 || event) && (
        <>
          <Tooltip>{getTooltipContent()}</Tooltip>
        </>
      )}
      {event && (
        <EventIndicator color={event.calendarInfo?.color}>
          <EventDot />
          <div font-size="6px">{event.summary}</div>
        </EventIndicator>
      )}
    </StyledTimeSlot>
  );
};

const StyledTimeSlot = styled.div`
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  height: 24px;
  cursor: pointer;
  user-select: none;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => (props.isSelected ? "white" : "black")};
  transition: background-color 0.15s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.813rem;
  position: relative;

  ${({ $hasEvent, $eventColor }) =>
    $hasEvent &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background-color: ${$eventColor || "#4285f4"};
    }
  `}

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#3b82f6" : "#f3f4f6")};
  }

  &:active {
    background-color: ${(props) => (props.isSelected ? "#2563eb" : "#e5e7eb")};
  }
`;

const Count = styled.span`
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 0.75rem;
  color: inherit;
  font-weight: 500;
`;

const Tooltip = styled.div`
  position: absolute;
  visibility: hidden;
  background-color: #1f2937;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: pre-line;
  z-index: 10;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);

  ${StyledTimeSlot}:hover & {
    visibility: visible;
  }
`;

const EventIndicator = styled.div`
  position: absolute;
  left: 4px;
  display: flex;
  align-items: center;
`;

const EventDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
`;

export default TimeSlot;
