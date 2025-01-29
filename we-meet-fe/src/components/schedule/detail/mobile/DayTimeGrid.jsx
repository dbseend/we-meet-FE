import { useEffect, useState } from "react";
import styled from "styled-components";
import { parseISOString } from "../../../../utils/dateTimeFormat";
import TimeSlot from "./TimSlot";

const DayTimeGrid = ({ date, timeSlots, availableTimes, respondedData, setRespondedData }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [events, setEvents] = useState([]);

  const [selectedMap, setSelectedMap] = useState(new Map());
  const [availabilityMap, setAvailabilityMap] = useState(new Map());

  const getIsSelected = () =>{
    
  }


  // 특정 날짜와 시간에 대한 사용자 조회
  const getAvailableUsers = (date, time) => {
    const key = `${date}-${time}`;
    return availabilityMap.get(key) || [];
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
          const key = {date}-{time};
          const event = getEventForTimeSlot(time);
          const availableUsers = getAvailableUsers(date, time);
          const isSelected = availableUsers.length > 0;

          return (
            <TimeSlot
              key={`${date}-${time}`}
              isSelected={isSelected}
              // availableUsers={availableUsers}
              // event={event}
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
