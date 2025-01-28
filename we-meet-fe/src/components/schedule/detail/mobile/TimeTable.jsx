import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchMeetingAvailability } from "../../../../api/schedule/ScheduleAPI";
import { convertToUTC, sortTimeSlots } from "../../../../utils/dateTimeFormat";
import DayTimeGrid from "./DayTimeGrid";

const TimeTable = ({
  time_range_from,
  time_range_to,
  dates,
  availableTimes,
  setAvailableTimes,
  currentDateIndex,
  MAX_DAYS_SHOWN,
}) => {
  const [visibleDates, setVisibleDates] = useState([]);

  useEffect(() => {
    const getVisibleDates = () =>{
      const start = currentDateIndex * MAX_DAYS_SHOWN;
      const newVisibleDates = dates.slice(
        start,
        Math.min(start + MAX_DAYS_SHOWN, dates.length)
      );
      setVisibleDates(newVisibleDates);
    }
    if (dates) {
      getVisibleDates();
    }

    
  }, [dates, currentDateIndex]);

  // 시간 선택 함수
  const handleTimeSelect = (date, time) => {
    const selectedDateTime = convertToUTC(date, time);

    setAvailableTimes((prev) => {
      const existingTimeIndex = prev.findIndex(
        (slot) => slot.available_time === selectedDateTime
      );

      // 이미 선택된 시간이면 제거
      if (existingTimeIndex !== -1) {
        return prev.filter((_, index) => index !== existingTimeIndex);
      }

      // 새로운 시간 추가 및 정렬
      const newTime = {
        available_time: selectedDateTime,
        priority: "available", // TODO: 사용자가 선택 할 수 있도록 추후에 변경 필요
      };

      return sortTimeSlots([...prev, newTime]);
    });
  };

  // 시작, 종료 시간 기반으로 시간표 생성(30분 단위)
  // TODO: 15분 단위로 변경
  const generateTimeSlots = () => {
    if (!time_range_from && !time_range_to) return [];
    const slots = [];
    const [startHour] = time_range_from.split(":").map(Number);
    const [endHour] = time_range_to.split(":").map(Number);

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

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
            key={date}
            date={date}
            timeSlots={timeSlots}
            availableTimes={availableTimes}
            onTimeSelect={handleTimeSelect}
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
