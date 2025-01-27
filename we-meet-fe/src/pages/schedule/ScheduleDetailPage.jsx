import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMeeting } from "../../api/schedule/ScheduleAPI";
import { copyToClipboard } from "../../utils/util";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, Link } from "lucide-react";

const ScheduleDetailPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [meetingData, setMeetingData] = useState(
    location.state?.meetingData || null
  );
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const MAX_DAYS_SHOWN = 3;
  // 미팅 데이터 가져오기
  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const result = await getMeeting(id);
        console.log(result);

        if (result.success) {
          setMeetingData(result.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch meeting data:", error);
        setIsLoading(false);
      }
    };

    if (!meetingData) {
      console.log("fetch meeting data");
      fetchMeetingData();
    }
  }, [id]);

  // 날짜 이동 핸들러
  const handleDateNavigation = (direction) => {
    setCurrentDateIndex((prev) => {
      const maxIndex = Math.ceil(meetingData.dates.length / MAX_DAYS_SHOWN) - 1;
      if (direction === "next") {
        return Math.min(prev + 1, maxIndex);
      }
      return Math.max(prev - 1, 0);
    });
  };

  // 현재 페이지에 표시될 날짜들을 계산하는 함수
  const getVisibleDates = () => {
    if (!meetingData?.dates) return [];
    const start = currentDateIndex * MAX_DAYS_SHOWN;
    return meetingData.dates.slice(
      start,
      Math.min(start + MAX_DAYS_SHOWN, meetingData.dates.length)
    );
  };

  const visibleDates = getVisibleDates();
  const canNavigatePrev = currentDateIndex > 0;
  const canNavigateNext =
    (currentDateIndex + 1) * MAX_DAYS_SHOWN < meetingData.dates.length;

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <Container>
      {/* 헤더 섹션 */}
      <Header>
        <Title>{meetingData.title}</Title>
        <Description>{meetingData.description}</Description>
        <CopyButton onClick={copyToClipboard}>
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
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  max-width: 100%;
  margin: 0 auto;
  background: white;
  overflow-x: hidden; // 가로 스크롤 방지
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

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DateDisplay = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  flex: 1;
  text-align: center;
  min-width: 0;
  padding: 0 0.5rem;
`;
export default ScheduleDetailPage;
