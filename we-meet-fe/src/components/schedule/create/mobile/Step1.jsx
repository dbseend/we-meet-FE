import styled from "styled-components";
import Calendar_Mobile from "./Calendar_Mobile";
import { ArrowRight } from "lucide-react";

const Step1 = ({ meetingData, setMeetingData }) => {
  return (
    <>
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
        <Input
          type="text"
          placeholder="회의에 대한 설명을 입력하세요"
          value={meetingData.description}
          onChange={(e) =>
            setMeetingData({ ...meetingData, description: e.target.value })
          }
        />
      </FormGroup>

      <Calendar_Mobile
        meetingData={meetingData}
        setMeetingData={setMeetingData}
      />
    </>
  );
};

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

export default Step1;
