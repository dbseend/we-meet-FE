import { ChevronLeft, ChevronRight, Link } from "lucide-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getMeeting,
  getMeetingAvailiableTimes,
  submitTimeSelections,
} from "../../../api/meeting/MeetingAPI";
import { useAuth } from "../../../context/AuthContext";
import DayTimeGrid from "./DayTimeGrid";
import ParticipantList from "./ParticipantList";
import { generateUUID } from "../../../utils/formatUtils";

/**
 * MeetingScheduler - 메인 컴포넌트
 * 전체 미팅 스케줄러 기능을 관리
 */
const MeetingScheduler = () => {
  const { user } = useAuth();
  const [submissionData, setSubmissionData] = useState({
    participant_id: user ? user.id : generateUUID(),
    meeting_id: window.location.pathname.split("/").pop(),
    user_name: user ? user.user_metadata.name : "",
    selected_times: [],
  });

  const [meetingData, setMeetingData] = useState(null);
  const [availiableTimes, setAvailiableTimes] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const MAX_DAYS_SHOWN = 3;

  useEffect(() => {
    // 미팅 데이터 불러오기
    const fetchMeetingData = async () => {
      try {
        const meetingId = window.location.pathname.split("/").pop();
        const { data, error: meetingError } = await getMeeting(meetingId);

        if (meetingError) throw meetingError;
        setMeetingData(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch meeting data:", err);
      } finally {
        setLoading(false);
      }
    };

    // 미팅 참여 응답 불러오기
    const fetchAvailiableTimes = async () => {
      try {
        const meetingId = window.location.pathname.split("/").pop();
        const { data, error: meetingError } = await getMeetingAvailiableTimes(
          meetingId
        );
        console.log("fetchAvailiableTimes ", data);

        if (meetingError) throw meetingError;
        setAvailiableTimes(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch meeting aviliable times data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingData();
    fetchAvailiableTimes();
  }, []);

  // 시간 슬롯 생성
  const generateTimeSlots = () => {
    if (!meetingData) return [];
    const slots = [];
    const [startHour] = meetingData.time_range_start.split(":").map(Number);
    const [endHour] = meetingData.time_range_end.split(":").map(Number);

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const getVisibleDates = () => {
    if (!meetingData?.dates) return [];
    const start = currentDateIndex * MAX_DAYS_SHOWN;
    return meetingData.dates.slice(
      start,
      Math.min(start + MAX_DAYS_SHOWN, meetingData.dates.length)
    );
  };

  const handleDateNavigation = (direction) => {
    setCurrentDateIndex((prev) => {
      const maxIndex = Math.ceil(meetingData.dates.length / MAX_DAYS_SHOWN) - 1;
      if (direction === "next") {
        return Math.min(prev + 1, maxIndex);
      }
      return Math.max(prev - 1, 0);
    });
  };

  // 시간 선택 핸들러
  const handleTimeSelect = (date, time, meetingStartTime = "07:00") => {
    console.log("date: ", date, " time: ", time );
    const [hour, minutes] = time.split(":").map(Number);
    const actualTime = `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  
    setSubmissionData((prev) => ({
      ...prev,
      selected_times: prev.selected_times.some(
        slot => slot.date === date && slot.time === actualTime
      )
        ? prev.selected_times.filter(
            slot => !(slot.date === date && slot.time === actualTime)
          )
        : [...prev.selected_times, { date, time: actualTime }].sort((a, b) =>
            a.date === b.date
              ? a.time.localeCompare(b.time)
              : a.date.localeCompare(b.date)
          ),
    }));
  };

  const handleAvailiableTimeSubmit = async () => {
    console.log(submissionData.selected_times);
    const formattedTimes = submissionData.selected_times.map((slot) => {
      const [year, month, day] = slot.date.split('-');
      const [hours, minutes] = slot.time.split(':');
      return new Date(Date.UTC(year, month - 1, day, hours, minutes))
        .toISOString()
        .replace("Z", "+00");
    });
    console.log(formattedTimes);
    if (submissionData.user_name == "") {
      alert("이름을 입력해주세요");
      return;
    }

    if (submissionData.selected_times.length === 0) {
      alert("시간을 선택해주세요");
      return;
    }


    setSubmissionData((prev) => ({
      ...prev,
      selected_times: formattedTimes,
    }));

    const submitData = {
      ...submissionData,
      selected_times: formattedTimes,
    };

    await submitTimeSelections(submitData);
  };

  // URL 복사 핸들러
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("URL이 클립보드에 복사되었습니다.");
    } catch (err) {
      alert("URL 복사에 실패했습니다.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!meetingData) return <div>Meeting not found</div>;

  const timeSlots = generateTimeSlots();
  const visibleDates = getVisibleDates();
  const canNavigatePrev = currentDateIndex > 0;
  const canNavigateNext =
    (currentDateIndex + 1) * MAX_DAYS_SHOWN < meetingData.dates.length;

  return (
    <Container>
      {/* 헤더 섹션 */}
      <Header>
        <Title>{meetingData.title}</Title>
        <Description>{meetingData.description}</Description>
        <CopyButton onClick={handleCopyUrl}>
          <Link size={18} />
          URL 복사
        </CopyButton>
      </Header>

      {/* 날짜 네비게이션 */}
      <DateNavigation>
        <NavButton
          onClick={() => handleDateNavigation("prev")}
          disabled={!canNavigatePrev}
        >
          <ChevronLeft size={24} />
        </NavButton>
        <DateDisplay>
          {visibleDates[0]} ~ {visibleDates[visibleDates.length - 1]}
        </DateDisplay>
        <NavButton
          onClick={() => handleDateNavigation("next")}
          disabled={!canNavigateNext}
        >
          <ChevronRight size={24} />
        </NavButton>
      </DateNavigation>

      {/* 시간표 */}
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
              onTimeSelect={handleTimeSelect}
              availableTimes={availiableTimes}
              selectedIds={selectedIds}
            />
          ))}
        </GridContainer>
      </TimeTableSection>

      <Content>
        {!user && (
          <Input
            placeholder="이름을 입력하세요"
            value={submissionData.user_name}
            onChange={(e) =>
              setSubmissionData((prev) => ({
                ...prev,
                user_name: e.target.value,
              }))
            }
          />
        )}
        <ButtonContainer>
          <UserName>{user ? `${user.user_metadata.name}님` : ""}</UserName>
          <SubmitButton onClick={handleAvailiableTimeSubmit}>
            시간 제출
          </SubmitButton>
        </ButtonContainer>
      </Content>

      {availiableTimes && (
        <ParticipantList
          availableTimes={availiableTimes}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}
    </Container>
  );
};

// 시간 라벨 스타일 수정
const TimeLabel = styled.div`
  height: 24px; // TimeSlot과 동일한 높이
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.25rem;
  color: #666;
  font-size: 0.75rem;
`;

// 날짜 헤더 스타일 수정
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

// 그리드 컨테이너 스타일 수정
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.daysCount}, 1fr);
  flex: 1;
  min-width: 0;
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
`;

// 시간표 섹션 스타일 수정
const TimeTableSection = styled.div`
  display: flex;
  // margin: 0 -1rem; // 네거티브 마진으로 컨테이너 패딩 상쇄
`;

// 시간 라벨 컨테이너 스타일 수정
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

// 전체 컨테이너 스타일 수정
const Container = styled.div`
  padding: 1rem;
  max-width: 100%;
  margin: 0 auto;
  background: white;
  overflow-x: hidden; // 가로 스크롤 방지
`;

// 네비게이션 버튼 스타일 수정
const NavButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${(props) => (props.disabled ? "#ccc" : "#333")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px; // 최소 터치 영역 확보

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "scale(0.95)")};
  }
`;

// 날짜 표시 스타일 수정
const DateDisplay = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  flex: 1;
  text-align: center;
  min-width: 0;
  padding: 0 0.5rem;
`;

// 복사 버튼 스타일 수정
const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  justify-content: center;
  font-size: 0.875rem;

  &:active {
    background: #f5f5f6;
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const SubmitButton = styled.button`
  width: 8rem;
  padding: 0.625rem;
  background: #4b9bff;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

  &:active {
    background: #3b82f6;
  }
`;

export default MeetingScheduler;
