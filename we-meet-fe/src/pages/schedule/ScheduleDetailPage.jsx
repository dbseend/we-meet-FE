import { ChevronLeft, ChevronRight, Link } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { getMeeting } from "../../api/schedule/ScheduleAPI";
import TimeTable from "../../components/schedule/detail/mobile/TimeTable";
import DateNavigation from "../../components/schedule/detail/mobile/DateNavigation";
import { useAuth } from "../../context/AuthContext";
import { copyToClipboard, generateUUID } from "../../utils/util";

const ScheduleDetailPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [meetingData, setMeetingData] = useState(
    location.state?.meetingData || null
  );
  const [submissionData, setSubmissionData] = useState({
    participant_id: user ? user.id : generateUUID(),
    meeting_id: window.location.pathname.split("/").pop(),
    user_name: user ? user.user_metadata.name : "",
    selected_times: [],
  });
  const [availiableTimes, setAvailiableTimes] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [events, setEvents] = useState([]);
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
      <DateNavigation
        dates={meetingData.dates}
        currentDateIndex={currentDateIndex}
        setCurrentDateIndex={setCurrentDateIndex}
      />

      {/* 시간표 */}
      <TimeTable
        time_range_from={meetingData.time_range_from}
        time_range_to={meetingData.time_range_to}
        dates={meetingData.dates}
        submissionData={submissionData}
        setSubmissionData={setSubmissionData}
        events={events}
        availiableTimes={availiableTimes}
        selectedIds={selectedIds}
      />
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

export default ScheduleDetailPage;
