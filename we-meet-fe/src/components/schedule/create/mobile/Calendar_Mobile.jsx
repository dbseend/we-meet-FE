import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar_Mobile = ({ meetingData, setMeetingData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = (date) => {
    const dateString = date.toISOString();
    const newDates = Array.isArray(meetingData.dates)
      ? [...meetingData.dates]
      : [];

    if (newDates.includes(dateString)) {
      newDates.splice(newDates.indexOf(dateString), 1);
    } else {
      newDates.push(dateString);
    }

    setMeetingData({
      ...meetingData,
      dates: newDates,
    });
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = useCallback(() => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = startDayOfMonth(currentDate);
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    const daysInPreviousMonth = daysInMonth(previousMonth);

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          daysInPreviousMonth - i
        ),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          i
        ),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  const changeMonth = (increment) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const calendarDays = generateCalendarDays();

  return (
    <CalendarContainer>
      <Header>
        <Button onClick={() => changeMonth(-1)}>
          <ChevronLeft />
        </Button>
        <Title>
          {currentDate.getFullYear()}.{" "}
          {(currentDate.getMonth() + 1).toString().padStart(2, "0")}
        </Title>
        <Button onClick={() => changeMonth(1)}>
          <ChevronRight />
        </Button>
      </Header>

      <WeekDaysGrid>
        {weekDays.map((day, index) => (
          <WeekDay key={day} $isSunday={index === 0} $isSaturday={index === 6}>
            {day}
          </WeekDay>
        ))}
      </WeekDaysGrid>

      <DaysGrid>
        {calendarDays.map(({ date, isCurrentMonth }) => {
          const dayOfWeek = date.getDay();
          return (
            <Day
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              $isOtherMonth={!isCurrentMonth}
              $isSelected={meetingData.dates.includes(date.toISOString())}
              $isSunday={dayOfWeek === 0}
              $isSaturday={dayOfWeek === 6}
            >
              {date.getDate()}
            </Day>
          );
        })}
      </DaysGrid>
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  background: white;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a1a1a;
`;

const Button = styled.button.attrs({ type: "button" })`
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #1a1a1a;
  }
`;

const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  border-bottom: 1px solid #eee;
  padding: 0.5rem;
`;

const WeekDay = styled.div`
  font-size: 0.875rem;
  color: ${(props) =>
    props.$isSunday ? "#ff4d4d" : props.$isSaturday ? "#4d4dff" : "#666"};
  padding: 0.5rem;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
`;

const Day = styled.button.attrs({ type: "button" })`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border: none;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  color: ${(props) =>
    props.$isOtherMonth
      ? "#ccc"
      : props.$isSunday
      ? "#ff4d4d"
      : props.$isSaturday
      ? "#4d4dff"
      : "#1a1a1a"};

  ${(props) =>
    props.$isSelected &&
    `
    background-color: #eee;
    border-radius: 50%;
  `}

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#e0e0e0" : "#f5f5f5")};
  }
`;

export default Calendar_Mobile;
