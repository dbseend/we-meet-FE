import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  addMeetingAvailability,
  fetchMeetingAvailability,
  getMeeting,
} from "../../api/schedule/ScheduleAPI";
import DateNavigation from "../../components/schedule/detail/mobile/DateNavigation";
import TimeTable from "../../components/schedule/detail/mobile/TimeTable";
import { useAuth } from "../../context/AuthContext";
import { generateTimeSlots } from "../../utils/dateTimeFormat";
import { copyToClipboard, generateUUID } from "../../utils/util";

const ScheduleDetailPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const initMeetingState = {
    meeting_id: "",
    creator_id: "",
    anonymous_creator_id: "",
    title: "",
    description: "",
    dates: [],
    time_range_from: "",
    time_range_to: "",
    is_online: false,
    deadline: "",
    max_participants: 0,
    online_meeting_url: "",
    current_participants: 0,
    recommended_times: [],
    meeting_participants: [],
  };
  const [meetingData, setMeetingData] = useState(
    location.state?.meetingData || initMeetingState
  );

  // 투표 응답: 사용자 정보
  const [participantData, setParticipantData] = useState({
    participant_id: generateUUID(),
    meeting_id: id,
    user_id: user ? user.id : null,
    anonymous_user_id: user ? null : generateUUID(),
    user_name: user ? user.user_metadata.name : "",
    available_times: [],
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [visibleDates, setVisibleDates] = useState([]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const MAX_DAYS_SHOWN = 3;

  const [currentStep, setCurrentStep] = useState(0);

  // 데이터 페칭을 위한 useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const [meetingResult, availabilityResult] = await Promise.all([
          meetingData.meeting_id === ""
            ? getMeeting(id)
            : Promise.resolve({ success: true, data: meetingData }),
          fetchMeetingAvailability(id),
        ]);

        if (meetingResult.success && availabilityResult.success) {
          // 두 결과 모두 성공했을 때만 상태 업데이트
          setMeetingData({
            ...meetingResult.data,
            meeting_participants: availabilityResult.data,
          });
        } else {
          // 하나라도 실패했을 경우 에러 처리
          console.error(
            "Failed to fetch data:",
            meetingResult.error || availabilityResult.error
          );
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 보이는 날짜 계산을 위한 useEffect
  useEffect(() => {
    if (!meetingData?.dates) return;

    const start = currentDateIndex * MAX_DAYS_SHOWN;
    const newVisibleDates = meetingData.dates.slice(
      start,
      Math.min(start + MAX_DAYS_SHOWN, meetingData.dates.length)
    );
    setVisibleDates(newVisibleDates);
  }, [meetingData?.dates, currentDateIndex, MAX_DAYS_SHOWN]);

  // 시간 슬롯 생성을 위한 useEffect
  useEffect(() => {
    if (
      meetingData?.time_range_from === "" &&
      meetingData?.time_range_to === ""
    )
      return;

    const slots = generateTimeSlots(
      meetingData.dates,
      meetingData.time_range_from,
      meetingData.time_range_to,
      meetingData.meeting_participants
    );
    setTimeSlots(slots);
  }, [meetingData?.time_range_from, meetingData?.time_range_to]);

  const handleAvailiableTimeSubmit = async () => {
    try {
      const result = await addMeetingAvailability(participantData);
    } catch (error) {
      console.error("미팅 응답 실패:", error);
      alert("미팅 응답 실패");
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <Container>
      {/* 헤더 섹션 */}
      <Header>
        <Title>{meetingData.title}</Title>
        <Description>{meetingData.description}</Description>
      </Header>

      {currentStep == 0 ? (
        <MenuButtonGroup>
          <CopyButton onClick={copyToClipboard}>
            <Link size={18} />
            URL 복사
          </CopyButton>
          <CopyButton onClick={() => setCurrentStep(1)}>
            <Link size={18} />
            시간 추가
          </CopyButton>
        </MenuButtonGroup>
      ) : currentStep == 1 ? (
        <StepContainer>
          <div>1단계: 선호시간을 선택해주세요</div>
          <MenuButtonGroup>
            <CopyButton onClick={() => setCurrentStep(2)}>
              <Link size={18} />
              다음
            </CopyButton>
            <CopyButton onClick={() => setCurrentStep(0)}>
              <Link size={18} />
              취소
            </CopyButton>
          </MenuButtonGroup>
        </StepContainer>
      ) : (
        <StepContainer>
          <div>2단계: 가능시간을 선택해주세요</div>
          <MenuButtonGroup>
            <CopyButton onClick={() => setCurrentStep(0)}>
              <Link size={18} />
              완료
            </CopyButton>
            <CopyButton onClick={() => setCurrentStep(0)}>
              <Link size={18} />
              취소
            </CopyButton>
          </MenuButtonGroup>
        </StepContainer>
      )}

      {/* 날짜 네비게이션 */}
      <DateNavigation
        dates={meetingData.dates}
        currentDateIndex={currentDateIndex}
        setCurrentDateIndex={setCurrentDateIndex}
        MAX_DAYS_SHOWN={MAX_DAYS_SHOWN}
      />

      {/* 시간표 */}
      <TimeTable
        timeSlots={timeSlots}
        setTimeSlots={setTimeSlots}
        visibleDates={visibleDates}
        meetingData={meetingData}
        participantData={participantData}
        setParticipantData={setParticipantData}
        currentStep={currentStep}
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
          {user ? <div>{user.name}</div> : <div>로그인 안 함</div>}
          <SubmitButton onClick={handleAvailiableTimeSubmit}>
            제출하기
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
  display: flex;
  flex-direction: row;
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

const MenuButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
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
