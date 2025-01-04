import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createMeeting } from "../../../api/meeting/MeetingAPI";
import { useAuth } from "../../../context/AuthContext";
import { generateUUID } from "../../../utils/formatUtils";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";
import { PageContainer } from "../../../styles/Container.styles";

const CreateMeetingPage = () => {
  const { user, loading, signOut } = useAuth();
  // 미팅 등록 시 필요한 정보
  const [meetingData, setMeetingData] = useState({
    creator_id: user ? user.id : generateUUID(),
    title: "",
    description: "",
    dates: [],
    time_range_start: "09:00",
    time_range_end: "18:00",
    is_online: false,
  });

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  // 미팅 생성 폼 제출 핸들러
  const handleCreateMeetingSubmit = async (e) => {
    console.log("meetingData.dates:", meetingData.dates);
    e.preventDefault();
    if (!meetingData.title || meetingData.dates.length === 0) {
      return;
    }

    try {
      const result = await createMeeting(meetingData);
      if (result.success) {
        navigate(`/meeting/${result.data[0].meeting_id}`);
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  // Setup mouse event listeners
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // 마우스 이벤트 핸들러 - 날짜 선택
  const handleMouseDown = (date) => {
    console.log(date);
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    setIsDragging(true);
    toggleDateSelection(date);
  };

  const handleMouseEnter = (date) => {
    if (isDragging) {
      toggleDateSelection(date);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculate calendar grid properties
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // 캘린더 월 이동 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // 날짜 선택 판단 함수
  const isDateSelected = (date) => {
    return meetingData.dates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );
  };

  // 날짜 선택 핸들러
  const toggleDateSelection = (date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;

    setMeetingData((prev) => {
      const dateExists = isDateSelected(date);
      return {
        ...prev,
        dates: dateExists
          ? prev.dates.filter((d) => d.toDateString() !== date.toDateString())
          : [...prev.dates, date],
      };
    });
  };
  
  return (
    <PageContainer>
      <Form onSubmit={handleCreateMeetingSubmit}>
        {/* Title input section */}
        <FormGroup>
          <Label>미팅명</Label>
          <Input
            type="text"
            name="title"
            value={meetingData.title}
            onChange={(e) =>
              setMeetingData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="미팅 제목을 입력하세요"
            required
          />
        </FormGroup>

        {/* Description input section */}
        <FormGroup>
          <Label>설명</Label>
          <TextArea
            name="description"
            value={meetingData.description}
            onChange={(e) =>
              setMeetingData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="미팅에 대한 설명을 입력하세요"
            rows={3}
          />
        </FormGroup>

        {/* Date selection section */}
        <FormGroup>
          <Label>날짜 선택</Label>
          <CalendarContainer>
            <CalendarHeader>
              <CalendarButton onClick={handlePrevMonth}>
                {/* Previous month icon */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </CalendarButton>
              <div>
                {currentDate.getFullYear()}년 {months[currentDate.getMonth()]}
              </div>
              <CalendarButton onClick={handleNextMonth}>
                {/* Next month icon */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </CalendarButton>
            </CalendarHeader>

            <CalendarGrid>
              {/* Weekday headers */}
              {weekDays.map((day, index) => (
                <WeekDay key={index}>{day}</WeekDay>
              ))}

              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const date = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  index + 1
                );
                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                const isSelected = isDateSelected(date);

                return (
                  <DateCell
                    key={index}
                    isPast={isPast}
                    isSelected={isSelected}
                    onMouseDown={() => handleMouseDown(date)}
                    onMouseEnter={() => handleMouseEnter(date)}
                  >
                    {index + 1}
                  </DateCell>
                );
              })}
            </CalendarGrid>
          </CalendarContainer>

          {/* {meetingData.is_online && (
            <InfoText>
              • 온라인 미팅 링크는 미팅 생성 후 참가자들에게 공유됩니다
            </InfoText>
          )} */}
        </FormGroup>

        {/* Time range selection */}
        <FormGroup>
          <Label>시간대 설정</Label>
          <TimeRangeContainer>
            <Input
              type="time"
              value={meetingData.time_range_start}
              onChange={(e) =>
                setMeetingData((prev) => ({
                  ...prev,
                  time_range_start: e.target.value,
                }))
              }
              max={meetingData.time_range_end}
            />
            <span>~</span>
            <Input
              type="time"
              value={meetingData.time_range_end}
              onChange={(e) =>
                setMeetingData((prev) => ({
                  ...prev,
                  time_range_end: e.target.value,
                }))
              }
              min={meetingData.time_range_start}
            />
          </TimeRangeContainer>
        </FormGroup>

        {/* Online meeting checkbox */}
        <Label>
          <Checkbox
            checked={meetingData.is_online}
            onChange={(e) =>
              setMeetingData((prev) => ({
                ...prev,
                is_online: e.target.checked,
              }))
            }
          />
          <span>온라인 미팅</span>
        </Label>

        {/* Submit button */}
        <Button type="submit">미팅 생성하기</Button>
      </Form>
    </PageContainer>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// Form input components
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

// Calendar components
const CalendarContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const CalendarButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #4b5563;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  padding: 0.5rem;
`;

const DateCell = styled.div`
  padding: 0.5rem;
  text-align: center;
  cursor: ${(props) => (props.isPast ? "not-allowed" : "pointer")};
  user-select: none;
  touch-action: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  color: ${(props) =>
    props.isPast ? "#d1d5db" : props.isSelected ? "white" : "inherit"};
  background-color: ${(props) =>
    props.isSelected ? "#3b82f6" : "transparent"};

  &:hover {
    background-color: ${(props) =>
      !props.isPast && !props.isSelected && "#f3f4f6"};
  }
`;

// Other styled components
const InfoText = styled.div`
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const TimeRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
`;

export default CreateMeetingPage;
