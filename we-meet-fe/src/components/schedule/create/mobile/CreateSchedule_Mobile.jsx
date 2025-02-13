import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../../../../api/schedule/ScheduleAPI";
import styled from "styled-components";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Step1 from "./Step1";
import Step2 from "./Step2";

const CreateSchedule_Mobile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    dates: [],
    expected_time: 60,
    time_range_from: "09:00:00",
    time_range_to: "18:00:00",
    is_online: false,
    online_meeting_url: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createMeeting(meetingData);
      if (result.success) {
        const meetingId = result.data[0].meeting_id;
        alert("미팅 생성 성공");

        navigate(`/meeting/${meetingId}`, {
          state: {
            meetingData: result.data[0],
          },
        });
      }
    } catch (error) {
      alert("미팅 생성 실패");
    }
  };

  const validateStep1 = () => {
    if (!meetingData.title.trim()) {
      alert("회의 제목을 입력해주세요");
      return;
    }

    if (meetingData.dates.length === 0) {
      alert("회의 날짜를 최소 1개 선택해주세요");
      return;
    }

    setStep(2);
  };

  return (
    <FormContainer>
      <Steps>
        <Step $active={step === 1} step={step}>
          기본 정보
        </Step>
        <Step $active={step === 2} step={step}>
          상세 정보
        </Step>
      </Steps>
      {step === 1 ? (
        <>
          <Step1
            meetingData={meetingData}
            setMeetingData={setMeetingData}
            setStep={setStep}
          />
          <Step1ButtonGroup>
            <StepButton onClick={() => validateStep1()}>
              다음
              <ArrowRight size={20} />
            </StepButton>
          </Step1ButtonGroup>
        </>
      ) : (
        <>
          <Step2
            meetingData={meetingData}
            setMeetingData={setMeetingData}
            setStep={setStep}
            handleSubmit={handleSubmit}
          />
          <Step2ButtonGroup>
            <StepButton onClick={() => setStep(1)}>
              이전
              <ArrowLeft size={20} />
            </StepButton>
            <StepButton onClick={(e) => handleSubmit(e)}>
              회의 생성
              <ArrowRight size={20} />
            </StepButton>
          </Step2ButtonGroup>
        </>
      )}
    </FormContainer>
  );
};

const FormContainer = styled.div`
  padding: 0 0.5rem 0.5rem 0.5rem;
`;

const Steps = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  color: ${(props) =>
    props.$active || props.step >= 2 ? "#ff9500" : "#9CA3AF"};
  font-weight: ${(props) => (props.$active || props.step >= 2 ? "600" : "400")};

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background: ${(props) =>
      props.$active || props.step >= 2 ? "#ff9500" : "#E5E7EB"};
    margin-top: 0.5rem;
  }
`;

const Step1ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  padding: 1rem 0.5rem 0 0;
  justify-content: flex-end;
`;

const Step2ButtonGroup = styled(Step1ButtonGroup)`
  justify-content: space-between;
`;

const StepButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ff4548;
`;

export default CreateSchedule_Mobile;
