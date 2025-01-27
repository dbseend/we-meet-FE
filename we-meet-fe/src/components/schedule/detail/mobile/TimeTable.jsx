import { useState, useEffect } from "react";
import styled from "styled-components";
import DayTimeGrid from "./DayTimeGrid";

const TimeTable = ({
  time_range_from,
  time_range_to,
  dates,
  submissionData,
  setSubmissionData,
  events,
  availiableTimes,
  selectedIds,
}) => {
  const [visibleDates, setVisibleDates] = useState([]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const MAX_DAYS_SHOWN = 3;

  useEffect(() => {
    if (dates) {
      const start = currentDateIndex * MAX_DAYS_SHOWN;
      const newVisibleDates = dates.slice(
        start,
        Math.min(start + MAX_DAYS_SHOWN, dates.length)
      );
      setVisibleDates(newVisibleDates);
    }
  }, [dates, currentDateIndex]);

  const handleTimeSelect = (date, time, meetingStartTime = "07:00") => {
    console.log("date: ", date, " time: ", time);
    const [hour, minutes] = time.split(":").map(Number);
    const actualTime = `${hour.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    setSubmissionData((prev) => ({
      ...prev,
      selected_times: prev.selected_times.some(
        (slot) => slot.date === date && slot.time === actualTime
      )
        ? prev.selected_times.filter(
            (slot) => !(slot.date === date && slot.time === actualTime)
          )
        : [...prev.selected_times, { date, time: actualTime }].sort((a, b) =>
            a.date === b.date
              ? a.time.localeCompare(b.time)
              : a.date.localeCompare(b.date)
          ),
    }));
  };

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
            selectedTimes={submissionData.selected_times}
            events={events[date] || []}
            onTimeSelect={handleTimeSelect}
            availableTimes={availiableTimes}
            selectedIds={selectedIds}
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
