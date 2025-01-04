import styled from "styled-components";
import TimeSlot from "./TimSlot";
import { parseISOString } from "../../../utils/dateUtils";

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
 * @param {Array} events - 해당 날짜의 Google Calendar 이벤트 목록
 * @returns {JSX.Element} 하루 시간표 그리드 컴포넌트
 */
const DayTimeGrid = ({
  date,
  timeSlots,
  selectedTimes,
  onTimeSelect,
  availableTimes,
  selectedIds,
  events = [], // 새로 추가된 prop
}) => {
  // 해당 날짜, 시간을 선택한 사용자 필터 함수
  const getAvailableUsers = (date, time) => {
    // 응답한 사용자가 아무도 없는 경우
    if (!availableTimes) {
      console.log("No available times data");
      return [];
    }

    const filteredUsers = availableTimes
      .filter(
        (at) => !selectedIds?.length || selectedIds.includes(at.participant_id)
      )
      .filter((at) => {
        return at.selected_times.some((datetime) => {
          const { date: atDate, time: atTime } = parseISOString(datetime);
          return atTime === time && atDate === date;
        });
      })
      .map((at) => ({
        name: at.user_name,
        id: at.user_id,
      }));
    return filteredUsers;
  };

  // 해당 시간대의 이벤트 찾기
  const getEventForTimeSlot = (time) => {
    if (!events?.length) return null;

    return events.find(event => {
      const eventStart = new Date(event.start.dateTime || event.start.date);
      const eventEnd = new Date(event.end.dateTime || event.end.date);
      const slotTime = new Date(`${date}T${time}`);
      
      return slotTime >= eventStart && slotTime < eventEnd;
    });
  };

  return (
    <DayColumn>
      <DateHeader>{date}</DateHeader>
      <TimeGridContainer>
        {timeSlots.map((time) => {
          const event = getEventForTimeSlot(time);
          return (
            <TimeSlot
              key={`${date}-${time}`}
              date={date}
              time={time}
              isSelected={selectedTimes.some(
                (slot) => slot.date === date && slot.time === time
              )}
              onClick={() => onTimeSelect(date, time)}
              availableUsers={getAvailableUsers(date, time)}
              event={event} // TimeSlot 컴포넌트에 이벤트 정보 전달
            />
          );
        })}
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