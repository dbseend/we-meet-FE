import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { parseISOString } from "../../../../utils/dateTimeFormat";
import TimeSlot from "./TimSlot";

const DayTimeGrid = ({ date, timeSlots, availableTimes, onTimeSelect }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [events, setEvents] = useState([]);

  const formattedAvailableTimes = useMemo(() => {
    return availableTimes.map((slot) => {
      const parsed = parseISOString(slot.available_time);
      return {
        ...slot,
        date: parsed.date,
        time: parsed.time,
      };
    });
  }, [availableTimes]);

  // 해당 날짜, 시간을 선택한 사용자 필터 함수
  const getAvailableUsers = (date, time) => {
    // 응답한 사용자가 아무도 없는 경우
    // if (availableTimes.length == 0) {
    //   console.log("No available times data");
    //   return [];
    // }

    // const filteredUsers = availableTimes
    //   .filter(
    //     (at) => !selectedIds?.length || selectedIds.includes(at.participant_id)
    //   )
    //   .filter((at) => {
    //     return at.availableTimes.some((datetime) => {
    //       const { date: atDate, time: atTime } = parseISOString(datetime);
    //       return atTime === time && atDate === date;
    //     });
    //   })
    //   .map((at) => ({
    //     name: at.user_name,
    //     id: at.user_id,
    //   }));
    // return filteredUsers;

    return [];
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
          const isSelected = formattedAvailableTimes.some((slot) => {
            const matches = slot.date === date && slot.time === time;
            // 디버깅 로그
            // if (matches) {
            //   console.log("Match found:", { date, time, slot });
            // } else{
            //   console.log("Match not found:", { date, time, slot });
            // }
            return matches;
          });

          return (
            <TimeSlot
              key={`${date}-${time}`}
              isSelected={isSelected}
              onClick={() => onTimeSelect(date, time)}
              availableUsers={getAvailableUsers(date, time)}
              event={event}
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
