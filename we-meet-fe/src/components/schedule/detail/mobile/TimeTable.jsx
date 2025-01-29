import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { convertToUTC, sortTimeSlots } from "../../../../utils/dateTimeFormat";
import DayTimeGrid from "./DayTimeGrid";

const TimeTable = ({
  time_range_from,
  time_range_to,
  dates,
  availableTimes,
  setAvailableTimes,
  currentDateIndex,
  respondedData,
  setRespondedData,
  MAX_DAYS_SHOWN,
}) => {
  const TimeSlotPriority = {
    AVAILABLE: "available",
    PREFERRED: "preferred"
  };
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());
  const [visibleDates, setVisibleDates] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getVisibleDates = () => {
      const start = currentDateIndex * MAX_DAYS_SHOWN;
      const newVisibleDates = dates.slice(
        start,
        Math.min(start + MAX_DAYS_SHOWN, dates.length)
      );
      setVisibleDates(newVisibleDates);
    };

    if (dates) {
      getVisibleDates();
    }
  }, [dates, currentDateIndex]);

  // 시간대 선택 처리 함수
  const handleTimeSelect = (date, timeSlot) => {
    setTimeSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.time === timeSlot.time
          ? { ...slot, isSelected: !slot.isSelected }
          : slot
      )
    );
  };

  // 시작, 종료 시간 기반으로 시간표 생성(30분 단위)
  // TODO: 15분 단위로 변경
  const generateTimeSlots = () => {
    if (!time_range_from && !time_range_to) return [];
    const slots = [];
    const [startHour] = time_range_from.split(":").map(Number);
    const [endHour] = time_range_to.split(":").map(Number);
  
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        isSelected: false,
        priority: TimeSlotPriority.AVAILABLE
      });
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:30`,
        isSelected: false,
        priority: TimeSlotPriority.AVAILABLE
      });
    }
    return slots;
  };
  
  return (
    <TimeTableSection>
      <TimeLabels>
        <DateHeader style={{ visibility: "hidden" }}>Date</DateHeader>
        {timeSlots.map((time, index) =>
          index % 2 === 0 ? <TimeLabel key={time}>{time}</TimeLabel> : null
        )}
      </TimeLabels>

      <GridContainer daysCount={visibleDates.length}>
        {visibleDates.map((date) => (
          <DayTimeGrid
            date={date}
            timeSlots={timeSlots}
            availableTimes={availableTimes}
            respondedData={respondedData}
            setRespondedData={setRespondedData}
          />
        ))}
      </GridContainer>
    </TimeTableSection>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.daysCount}, 1fr);
  flex: 1;
  min-width: 0;
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
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

const TimeTableSection = styled.div`
  display: flex;
  // margin: 0 -1rem; // 네거티브 마진으로 컨테이너 패딩 상쇄
`;

const TimeLabel = styled.div`
  height: 24px; // TimeSlot과 동일한 높이
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.25rem;
  color: #666;
  font-size: 0.75rem;
`;

const TimeLabels = styled.div`
  width: 50px;
  flex-shrink: 0;
  background: transparent;
  display: flex;
  flex-direction: column;

  ${TimeLabel} {
    position: relative;
    top: -12px;
    height: 48px;
  }
`;

export default TimeTable;
