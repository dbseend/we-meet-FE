import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "./Calendar";

const CreateMeetingForm = () => {
  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    dates: [],
    availableFrom: "09:00",
    availableTo: "18:00",
    isRemote: true,
    deadline: "17:00",
    attendeeCount: 4,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("meeting data", meetingData);
    // Submit logic
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

      <Calendar meetingData={meetingData} setMeetingData={setMeetingData}/>

      <FormGroup>
        <Label>회의 시간</Label>
        <TimeGroup>
          <TimeInput
            type="time"
            value={meetingData.availableFrom}
            onChange={(e) =>
              setMeetingData({ ...meetingData, availableFrom: e.target.value })
            }
          />
          <TimeLabel>부터</TimeLabel>
          <TimeInput
            type="time"
            value={meetingData.availableTo}
            onChange={(e) =>
              setMeetingData({ ...meetingData, availableTo: e.target.value })
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
            setMeetingData({ ...meetingData, deadline: e.target.value })
          }
        />
      </FormGroup>

      <FormGroup>
        <Label>참여 인원</Label>
        <Input
          type="number"
          placeholder="참여 인원을 입력하세요"
          value={meetingData.attendeeCount}
          onChange={(e) =>
            setMeetingData({
              ...meetingData,
              attendeeCount: parseInt(e.target.value),
            })
          }
        />
      </FormGroup>

      <CheckboxLabel>
        <span>원격 회의</span>
        <Checkbox
          type="checkbox"
          checked={meetingData.isRemote}
          onChange={(e) =>
            setMeetingData({ ...meetingData, isRemote: e.target.checked })
          }
        />
      </CheckboxLabel>

      <Button type="submit">생성하기</Button>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  // max-width: 600px;
  // margin: 2rem auto;
  padding: 0 0.5rem 0.5rem 0.5rem;
  // background: white;
  // border-radius: 20px;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
