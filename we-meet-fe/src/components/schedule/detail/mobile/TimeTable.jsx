import styled from "styled-components";
import { convertToUTC } from "../../../../utils/dateTimeFormat";
import DayTimeGrid from "./DayTimeGrid";

const TimeTable = ({
  timeSlots,
  setTimeSlots,
  visibleDates,
  participantData,
  setParticipantData,
  currentStep
}) => {

  const handleTimeSelect = (date, time) => {
    if(currentStep == 0) return ;

    const priority = currentStep == 1 ? "PREFER" : "AVAILABLE"
    const dateTimeKey = convertToUTC(date,time);

    setTimeSlots((prev) => {
      // 이전 선택 상태 확인 (최적화를 위해 미리 확인)
      const currentSlot = prev[date]?.find((slot) => slot.time === time);
      if (!currentSlot) return prev; // 해당 슬롯이 없으면 업데이트하지 않음

      const newIsSelected = !currentSlot.isSelected;

      // timeSlots 업데이트
      return {
        ...prev,
        [date]: prev[date].map((slot) =>
          slot.time === time ? { ...slot, isSelected: newIsSelected } : slot
        ),
      };
    });

    // participantData 업데이트 - 의존적인 상태이므로 함께 업데이트
    setParticipantData((prev) => {
      const availableTimes = prev.available_times || [];
      const timeExists = availableTimes.some(
        (slot) => slot.available_time === dateTimeKey
      );

      if (timeExists) {
        // 이미 존재하면 제거
        return {
          ...prev,
          available_times: availableTimes.filter(
            (slot) => slot.available_time !== dateTimeKey
          ),
        };
      } else {
        // 존재하지 않으면 추가
        return {
          ...prev,
          available_times: [
            ...availableTimes,
            {
              available_time: dateTimeKey,
              priority: priority,
            },
          ],
        };
      }
    });
  };

  return (
    <TimeTableSection>
      <TimeLabels>
        <DateHeader style={{ visibility: "hidden" }}>Date</DateHeader>
        {Object.values(timeSlots)[0]?.map((time, index) =>
          index % 2 === 0 ? (
            <TimeLabel key={time.time}>{time.time}</TimeLabel>
          ) : null
        )}
      </TimeLabels>

      <GridContainer daysCount={visibleDates.length}>
        {visibleDates.map((date) => (
          <DayTimeGrid
            key={date}
            date={date}
            timeSlots={timeSlots[date] || []}
            participantData={participantData}
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
