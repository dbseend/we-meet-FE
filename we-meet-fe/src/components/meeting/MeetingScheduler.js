import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Link, ChevronLeft, ChevronRight } from "lucide-react";
import { getMeeting } from "../../api/meeting/MeetingAPI";

/**
 * TimeSlot Component - 개별 시간 슬롯을 표시
 */

/**
 * DayTimeGrid Component - 단일 날짜의 시간표를 표시
 */
const DayTimeGrid = ({ date, timeSlots, selectedTimes, onTimeSelect }) => (
  <DayColumn>
    <DateHeader>{date}</DateHeader>
    <TimeGridContainer>
      {timeSlots.map(time => (
        <TimeSlot
          key={`${date}-${time}`}
          isSelected={selectedTimes[date]?.includes(time)}
          onClick={() => onTimeSelect(date, time)}
        >
          {time}
        </TimeSlot>
      ))}
    </TimeGridContainer>
  </DayColumn>
);

/**
 * MeetingScheduler Component - 메인 컴포넌트
 */
const MeetingScheduler = () => {
  // 상태 관리
  const [meetingData, setMeetingData] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const MAX_DAYS_SHOWN = 3;

  // 미팅 데이터 불러오기
  useEffect(() => {
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

    fetchMeetingData();
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

  // 표시할 날짜들 계산
  const getVisibleDates = () => {
    if (!meetingData?.dates) return [];
    const start = currentDateIndex;
    return meetingData.dates.slice(start, Math.min(start + MAX_DAYS_SHOWN, meetingData.dates.length));
  };

  // 날짜 네비게이션 핸들러
  const handleDateNavigation = (direction) => {
    setCurrentDateIndex(prev => {
      const maxIndex = meetingData.dates.length - MAX_DAYS_SHOWN;
      if (direction === 'next') {
        return Math.min(prev + 1, maxIndex);
      }
      return Math.max(prev - 1, 0);
    });
  };

  // 시간 선택 핸들러
  const handleTimeSelect = (date, time) => {
    setSelectedTimes(prev => {
      const currentTimes = prev[date] || [];
      const timeExists = currentTimes.includes(time);
      return {
        ...prev,
        [date]: timeExists 
          ? currentTimes.filter(t => t !== time)
          : [...currentTimes, time].sort()
      };
    });
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
  const canNavigateNext = currentDateIndex < meetingData.dates.length - MAX_DAYS_SHOWN;

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
          onClick={() => handleDateNavigation('prev')}
          disabled={!canNavigatePrev}
        >
          <ChevronLeft size={24} />
        </NavButton>
        <DateDisplay>
          {visibleDates[0]} ~ {visibleDates[visibleDates.length - 1]}
        </DateDisplay>
        <NavButton 
          onClick={() => handleDateNavigation('next')}
          disabled={!canNavigateNext}
        >
          <ChevronRight size={24} />
        </NavButton>
      </DateNavigation>

      {/* 시간표 */}
      <TimeTableSection>
        <TimeLabels>
          <DateHeader style={{ visibility: 'hidden' }}>Date</DateHeader>
          {timeSlots.map((time, index) => 
            index % 2 === 0 && (
              <TimeLabel key={time}>{time}</TimeLabel>
            )
          )}
        </TimeLabels>

        <GridContainer daysCount={visibleDates.length}>
          {visibleDates.map(date => (
            <DayTimeGrid
              key={date}
              date={date}
              timeSlots={timeSlots}
              selectedTimes={selectedTimes}
              onTimeSelect={handleTimeSelect}
            />
          ))}
        </GridContainer>
      </TimeTableSection>
    </Container>
  );
};

// TimeSlot 스타일 변경
const TimeSlot = styled.div`
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  height: 36px; // 높이 줄임
  cursor: pointer;
  user-select: none;
  background-color: ${props => props.isSelected ? '#4b9bff' : 'white'};
  color: ${props => props.isSelected ? 'white' : 'black'};
  transition: background-color 0.15s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.813rem;
  touch-action: manipulation;

  &:active {
    background-color: ${props => props.isSelected ? '#3b82f6' : '#f3f4f6'};
  }
`;

// 시간 라벨 스타일 수정
const TimeLabel = styled.div`
  height: 36px; // TimeSlot과 동일한 높이
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.25rem;
  color: #666;
  font-size: 0.75rem;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
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
  grid-template-columns: repeat(${props => props.daysCount}, 1fr);
  flex: 1;
  min-width: 0;
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
`;

// 시간표 섹션 스타일 수정
const TimeTableSection = styled.div`
  display: flex;
  margin: 0 -1rem; // 네거티브 마진으로 컨테이너 패딩 상쇄
`;

// 시간 라벨 컨테이너 스타일 수정
const TimeLabels = styled.div`
  width: 50px; // 너비 줄임
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
  background: #f9fafb;
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
  color: ${props => props.disabled ? '#ccc' : '#333'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px; // 최소 터치 영역 확보

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.95)'};
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

const DayColumn = styled.div`
  min-width: 0;
`;

const TimeGridContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default MeetingScheduler;