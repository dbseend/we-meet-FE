import styled from "styled-components";
import { formatTime } from "../../../../utils/dateTimeFormat";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Step2 = ({ meetingData, setMeetingData }) => {
  return (
    <>
      <FormGroup>
        <Label>회의 예정 시간</Label>
        <TimeGroup>
          <TimeInput
            type="time"
            value={meetingData.time_range_from}
            onChange={(e) =>
              setMeetingData({
                ...meetingData,
                time_range_from: formatTime(e.target.value),
              })
            }
          />
          <TimeLabel>부터</TimeLabel>
          <TimeInput
            type="time"
            value={meetingData.time_range_to}
            onChange={(e) =>
              setMeetingData({
                ...meetingData,
                time_range_to: formatTime(e.target.value),
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

const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TimeInput = styled(Input)`
  max-width: 150px;
`;

const TimeLabel = styled.span`
  color: #666;
  min-width: 4rem;
`;

export default Step2;
