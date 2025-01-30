import styled from "styled-components";
import TimeSlot from "./TimSlot";

const DayTimeGrid = ({ date, timeSlots, participantData, onTimeSelect }) => {
  
  return (
    <DayColumn>
      <DateHeader>{date}</DateHeader>
      {timeSlots.map((slot) => (
        <TimeSlot
          key={slot.time}
          onClick={() => onTimeSelect(date, slot.time)} 
          isSelected={slot.isSelected}
          priority={slot.priority}
        />
      ))}
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
