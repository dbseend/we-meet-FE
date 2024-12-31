import styled from "styled-components";

/**
 * TimeSlot 컴포넌트 - 개별 시간 슬롯을 표시
 * @param {boolean} isSelected - 선택 여부
 * @param {Function} onClick - 클릭 핸들러
 * @param {Array} availableUsers - 해당 시간에 가능한 사용자 목록
 */
const TimeSlot = ({ isSelected, onClick, availableUsers = [] }) => {
  const userCount = availableUsers.length;

  // 시간대별 참여 가능 인원에 따른 배경색 결정
  const getBackgroundColor = () => {
    if (isSelected) return "#4b9bff"; // 내가 선택한 시간
    if (userCount === 0) return "white"; // 아무도 선택하지 않은 시간

    // 참여 가능 인원이 많을수록 진한 색상 표시
    const intensity = Math.min(255, 255 - userCount * 30);
    return `rgb(255, ${intensity}, 0)`;
  };

  return (
    <StyledTimeSlot
      backgroundColor={getBackgroundColor()}
      isSelected={isSelected}
      onClick={onClick}
    >
      {userCount > 0 && (
        <Tooltip>{availableUsers.map((user) => user.name).join(", ")}</Tooltip>
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

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#3b82f6" : "#f3f4f6")};
  }

  &:active {
    background-color: ${(props) => (props.isSelected ? "#2563eb" : "#e5e7eb")};
  }
`;

const Tooltip = styled.div`
  position: absolute;
  visibility: hidden;
  background-color: #1f2937;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  z-index: 10;
  top: -2rem;

  ${StyledTimeSlot}:hover & {
    visibility: visible;
  }
`;

export default TimeSlot;
