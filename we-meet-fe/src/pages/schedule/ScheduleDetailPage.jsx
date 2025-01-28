import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMeeting } from "../../api/schedule/ScheduleAPI";
import { copyToClipboard, generateUUID } from "../../utils/util";
import styled from "styled-components";
import { Link } from "lucide-react";
import TimeTable from "../../components/schedule/detail/mobile/TimeTable";
import DateNavigation from "../../components/schedule/detail/mobile/DateNavigation";

const ScheduleDetailPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [meetingData, setMeetingData] = useState(
    location.state?.meetingData || null
  );
  // 투표 응답: 사용자 정보
  const [participantData, setParticipantData] = useState({
    participant_id: null,
    meeting_id: id,
    user_id: user ? user.id : null,
    anonymous_user_id: user ? null : generateUUID(),
    user_name: user ? user.user_metadata.name : "",
  });
  // 투표 응답: 선택 시간
  const [availableTimes, setAvailableTimes] = useState([
  ])


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
    } else {
      console.log("meeting data exists!");
      console.log(meetingData);
      setIsLoading(false);
    }
  }, [id]);

  // TODO: 투표 응답 
  const handleAvailiableTimeSubmit = async () => {
    console.log(participantData.availiable_times);
    const formattedTimes = participantData.availiable_times.map((slot) => {
      const [year, month, day] = slot.date.split("-");
      const [hours, minutes] = slot.time.split(":");
      return new Date(Date.UTC(year, month - 1, day, hours, minutes))
        .toISOString()
        .replace("Z", "+00");
    });
    console.log(formattedTimes);
    if (participantData.user_name == "") {
      alert("이름을 입력해주세요");
      return;
    }

    if (participantData.availiable_times.length === 0) {
      alert("시간을 선택해주세요");
      return;
    }

    setParticipantData((prev) => ({
      ...prev,
      availiable_times: formattedTimes,
    }));

    const submitData = {
      ...participantData,
      selected_times: formattedTimes,
    };

    // await submitTimeSelections(submitData);
  };

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
      <DateNavigation dates={meetingData.dates} />

      {/* 시간표 */}
      <TimeTable
        time_range_from={meetingData.time_range_from}
        time_range_to={meetingData.time_range_to}
        dates={meetingData.dates}
        participantData={participantData}
        setParticipantData={setParticipantData}
        availableTimes={availableTimes}
        setAvailableTimes={setAvailableTimes}
      />

      <Content>
        {!user && (
          <Input
            placeholder="이름을 입력하세요"
            value={participantData.user_name}
            onChange={(e) =>
              setParticipantData((prev) => ({
                ...prev,
                user_name: e.target.value,
              }))
            }
          />
        )}
        <ButtonContainer>
          <UserName>{user ? `${user.user_metadata.name}님` : ""}</UserName>
          <SubmitButton onClick={handleAvailiableTimeSubmit}>
            응답 제출
          </SubmitButton>
        </ButtonContainer>
      </Content>
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

export default ScheduleDetailPage;
