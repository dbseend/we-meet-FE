import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { createMeeting } from "../../../../api/schedule/ScheduleAPI";
import { generateUUID } from "../../../../utils/util";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styled from "styled-components";
import Step1 from "./Step1";
import Step2 from "./Step2";

const CreateSchedule_Mobile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [meetingData, setMeetingData] = useState({
    creator_id: null,
    anonymous_creator_id: null,
    title: "",
    description: "",
    dates: [],
    time_range_from: "09:00:00",
    time_range_to: "18:00:00",
    is_online: false,
    max_participants: 4,
    online_meeting_url: "",
  });

  // 로그인, 비로그인 사용자 구분
  useEffect(() => {
    setMeetingData((prevData) => ({
      ...prevData,
      creator_id: user ? user.id : null,
      anonymous_creator_id: user ? null : generateUUID(),
    }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateMeetingData();
    if (!isValid) {
      alert("필수 항목 모두 채워주세요");
      return;
    }

    try {
      const result = await createMeeting(meetingData);
      if (result.success) {
        const meetingId = result.data[0].meeting_id;
        console.log("미팅 생성 성공:", result.data);
        alert("미팅 생성 성공");

        navigate(`/meeting/${meetingId}`, {
          state: {
            meetingData: result.data[0],
          },
        });
      }
    } catch (error) {
      console.error("미팅 생성 실패:", error);
      alert("미팅 생성 실패");
    }
  };

  const validateMeetingData = () => {
    const errors = {};

    if (!meetingData.title.trim()) {
      errors.title = "회의 제목을 입력해주세요";
    }

    if (meetingData.dates.length === 0) {
      errors.dates = "회의 날짜를 선택해주세요";
    }

    if (meetingData.availableFrom >= meetingData.availableTo) {
      errors.time = "종료 시간은 시작 시간보다 늦어야 합니다";
    }

    if (meetingData.attendeeCount < 2) {
      errors.attendeeCount = "참여 인원은 2명 이상이어야 합니다";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const validateStep1 = () => {
    if (!meetingData.title.trim()) {
      alert("회의 제목을 입력해주세요");
      return;
    }

    if (meetingData.dates.length === 0) {
      alert("회의 날짜를 선택해주세요");
      return;
    }


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasPastDate = meetingData.dates.some((date) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate < today;
  });

  if (hasPastDate) {
    alert("오늘 이전 날짜는 선택할 수 없습니다.");
    return;
  }

    setStep(2);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Steps>
        <Step $active={step === 1}>기본 정보</Step>
        <Step $active={step === 2}>상세 정보</Step>
      </Steps>
      {step === 1 ? (
        <>
          <Step1
            meetingData={meetingData}
            setMeetingData={setMeetingData}
            setStep={setStep}
          />
          <Step1ButtonGroup>
            <StepButton type="button" onClick={() => validateStep1()} $primary>
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
            <StepButton type="button" onClick={() => setStep(1)} $primary>
              이전
              <ArrowLeft size={20} />
            </StepButton>
            <StepButton onClick={(e) => handleSubmit(e)} $primary>
              회의 생성
              <ArrowRight size={20} />
            </StepButton>
          </Step2ButtonGroup>
        </>
      )}
    </FormContainer>
  );
};

const FormContainer = styled.form`
  padding: 0 0.5rem 0.5rem 0.5rem;
`;

const Button = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.main2};
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #e68600;
  }
`;

const Steps = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  color: ${(props) => (props.$active ? "#ff9500" : "#9CA3AF")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background: ${(props) => (props.$active ? "#ff9500" : "#E5E7EB")};
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
  transition: all 0.2s;

  ${(props) =>
    props.$primary
      ? `
    background-color: #ff4548;
    color: white;
    &:hover { background-color: #ff4548; }
  `
      : props.$secondary
      ? `
    background-color: white;
    color: #ff4548;
    border: 2px solid #ff4548;
    &:hover { background-color: #fff1f1; }
  `
      : `
    color: #6B7280;
    &:hover { color: #374151; }
  `}
`;

export default CreateSchedule_Mobile;
