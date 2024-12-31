import styled from "styled-components";
import TimeSlot from "./TimSlot";
import {
  convertDBTimeToDisplay,
  parseISOString,
} from "../../../utils/dateUtils";

/**
 * DayTimeGrid 컴포넌트 - 하루의 전체 시간표를 표시
 *
 * @param {string} date - 표시할 날짜 (YYYY-MM-DD 형식)
 * @param {Array<string>} timeSlots - 표시할 시간 슬롯 배열 (예: ["09:00", "09:30", ...])
 * @param {Array<{date: string, time: string}>} selectedTimes - 선택된 시간 목록
 * @param {Function} onTimeSelect - 시간 선택 시 호출될 콜백 함수 (date, time) => void
 * @param {Array<{
 *   user_id: string,
 *   user_name: string,
 *   selected_times: Array<string>
 * }>} availableTimes - 각 사용자별 가능한 시간 정보
 * @returns {JSX.Element} 하루 시간표 그리드 컴포넌트
 */
const DayTimeGrid = ({
  date,
  timeSlots,
  selectedTimes,
  onTimeSelect,
  availableTimes,
}) => {
  // 해당 날짜, 시간을 선택한 사용자 필터 함수
  const getAvailableUsers = (date, time) => {
    // 응답한 사용자가 아무도 없는 경우
    if (!availableTimes) {
      console.log("No available times data");
      return [];
    }

    const filteredUsers = availableTimes
      .filter((at) => {
        return at.selected_times.some((datetime) => {
          const { date: atDate, time: dbTime } = parseISOString(datetime);
          const displayTime = convertDBTimeToDisplay(dbTime);
          return displayTime === time && atDate === date;
        });
      })
      .map((at) => ({
        name: at.user_name,
        id: at.user_id,
      }));
    return filteredUsers;
  };

  return (
    <DayColumn>
      <DateHeader>{date}</DateHeader>
      <TimeGridContainer>
        {timeSlots.map((time) => (
          <TimeSlot
            key={`${date}-${time}`}
            date={date}
            time={time}
            isSelected={selectedTimes.some(
              (slot) => slot.date === date && slot.time === time
            )}
            onClick={() => onTimeSelect(date, time)}
            availableUsers={getAvailableUsers(date, time)}
          />
        ))}
      </TimeGridContainer>
    </DayColumn>
  );
};

const DayColumn = styled.div`
  min-width: 0;
`;

const DateHeader = styled.div`
  font-size: 0.813rem;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem 0.25rem;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TimeGridContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default DayTimeGrid;
