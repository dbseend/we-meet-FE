import { useState } from "react";
import styled from "styled-components";
import TimeSlot from "./TimSlot";
import { parseISOString } from "../../../../utils/dateTimeFormat";

const DayTimeGrid = ({ date, timeSlots, availableTimes, onTimeSelect }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [events, setEvents] = useState([]);

  // 해당 날짜, 시간을 선택한 사용자 필터 함수
  const getAvailableUsers = (date, time) => {
    // 응답한 사용자가 아무도 없는 경우
    if (availableTimes.length == 0) {
      console.log("No available times data");
      return [];
    }

    const filteredUsers = availableTimes
      .filter(
        (at) => !selectedIds?.length || selectedIds.includes(at.participant_id)
      )
      .filter((at) => {
        return at.availableTimes.some((datetime) => {
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

    return events.find((event) => {
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
              isSelected={availableTimes.some(
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
