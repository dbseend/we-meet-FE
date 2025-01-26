import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "./Calendar";
import { useAuth } from "../../context/AuthContext";
import { formatTime } from "../../utils/dateTimeFormat";

const CreateMeetingForm = () => {
  const { user } = useAuth();

  const [meetingData, setMeetingData] = useState({
    creator_id: user ? user.id : null,
    anonymous_creator_id: user ? null : "generateUUID",
    title: "",
    description: "",
    dates: [],
    time_ragne_from: "09:00:00",
    time_ragne_to: "18:00:00",
    is_online: false,
    deadline: "18:00:00",
    max_participants: 4,
    online_meeting_url: "",
  });

  const handleSubmit = (e) => {
    console.log("meeting data", meetingData);
    e.preventDefault();

    const { isValid, errors } = validateMeetingData();

    if (!isValid) {
      alert(errors);
      return;
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

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* <FormHeader>
        <Title>회의 일정 만들기</Title>
      </FormHeader> */}

      <FormGroup>
        <Label>회의 제목</Label>
        <Input
          type="text"
          placeholder="회의 제목을 입력하세요"
          value={meetingData.title}
          onChange={(e) =>
            setMeetingData({ ...meetingData, title: e.target.value })
          }
        />
      </FormGroup>

      <FormGroup>
        <Label>회의 설명</Label>
        <TextArea
          placeholder="회의에 대한 설명을 입력하세요"
          value={meetingData.description}
          onChange={(e) =>
            setMeetingData({ ...meetingData, description: e.target.value })
          }
        />
      </FormGroup>

      <Calendar meetingData={meetingData} setMeetingData={setMeetingData} />

      <FormGroup>
        <Label>회의 예정 시간</Label>
        <TimeGroup>
          <TimeInput
            type="time"
            value={meetingData.time_ragne_from}
            onChange={(e) =>
              setMeetingData({
                ...meetingData,
                time_ragne_from: formatTime(e.target.value),
              })
            }
          />
          <TimeLabel>부터</TimeLabel>
          <TimeInput
            type="time"
            value={meetingData.time_ragne_to}
            onChange={(e) =>
              setMeetingData({
                ...meetingData,
                time_ragne_to: formatTime(e.target.value),
              })
            }
          />
          <TimeLabel>까지</TimeLabel>
        </TimeGroup>
      </FormGroup>

      <FormGroup>
        <Label>투표 마감 시간</Label>
        <TimeInput
          type="time"
          value={meetingData.deadline}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              deadline: formatTime(e.target.value),
            })
          }
        />
      </FormGroup>

      <FormGroup>
        <Label>참여 인원</Label>
        <Input
          type="number"
          placeholder="참여 인원을 입력하세요"
          value={meetingData.max_participants}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              max_participants: parseInt(e.target.value),
            })
          }
        />
      </FormGroup>

      <CheckboxLabel>
        <span>원격 회의</span>
        <Checkbox
          type="checkbox"
          checked={meetingData.is_online}
          onChange={(e) =>
            setMeetingData({ ...meetingData, is_online: e.target.checked })
          }
        />
      </CheckboxLabel>

      <Button type="submit">생성하기</Button>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  padding: 0 0.5rem 0.5rem 0.5rem;
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e8ecf4;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff9500;
    box-shadow: 0 0 0 2px rgba(255, 149, 0, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e8ecf4;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #ff9500;
    box-shadow: 0 0 0 2px rgba(255, 149, 0, 0.1);
  }
`;

const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TimeLabel = styled.span`
  color: #666;
  min-width: 4rem;
`;

const TimeInput = styled(Input)`
  max-width: 150px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  background: #ff9500;
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

export default CreateMeetingForm;
