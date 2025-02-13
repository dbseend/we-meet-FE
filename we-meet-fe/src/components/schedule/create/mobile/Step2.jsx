import styled from "styled-components";
import { ArrowDown } from "lucide-react";
import { formatTime } from "../../../../utils/dateTimeFormat";

const Step2 = ({ meetingData, setMeetingData }) => {

  // 회의 예상 시간 값 배열(30분~3시간)
  const timeOptions = Array.from({ length: 6 }, (_, i) => (i + 1) * 30);
  
  // 시간 범위 변경 핸들러
  const handleTimeChange = (field) => (e) => {
    setMeetingData({
      ...meetingData,
      [field]: formatTime(e.target.value),
    });
  };

  // 회의 예상 소요 변경 핸들러
  const handleExpectedTimeChange = (e) => {
    setMeetingData({
      ...meetingData,
      expected_time: parseInt(e.target.value),
    });
  };

  return (
    <Container>
      <FormGroup>
        <Label>회의 시간</Label>
        <TimeGroup>
          <TimeInputWrapper>
            <TimeInput
              type="time"
              value={meetingData.time_range_from}
              onChange={handleTimeChange("time_range_from")}
            />
            <TimeLabel>부터</TimeLabel>
          </TimeInputWrapper>
          <TimeInputWrapper>
            <TimeInput
              type="time"
              value={meetingData.time_range_to}
              onChange={handleTimeChange("time_range_to")}
            />
            <TimeLabel>까지</TimeLabel>
          </TimeInputWrapper>
        </TimeGroup>
      </FormGroup>

      <FormGroup>
        <Label>예상 소요 시간</Label>
        <Select
          value={meetingData.expected_time}
          onChange={handleExpectedTimeChange}
        >
          <option value="">예상 소요 시간을 선택하세요</option>
          {timeOptions.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes >= 60
                ? `${Math.floor(minutes / 60)}시간 ${minutes % 60 > 0 ? `${minutes % 60}분` : ''}`
                : `${minutes}분`}
            </option>
          ))}
        </Select>
      </FormGroup>

      <CheckboxGroup>
        <CheckboxLabel>
          <CheckboxText>원격 회의</CheckboxText>
          <Checkbox
            type="checkbox"
            checked={meetingData.is_online}
            onChange={(e) =>
              setMeetingData({ ...meetingData, is_online: e.target.checked })
            }
          />
        </CheckboxLabel>
      </CheckboxGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  color: #1a1a1a;
  font-size: 0.95rem;
  font-weight: 600;
`;

const Select = styled.select`
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2rem;
  padding-right: 2.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #ff9500;
    box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const TimeGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const TimeInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TimeInput = styled(Input)`
  width: 130px;
`;

const TimeLabel = styled.span`
  color: #4b5563;
  font-size: 0.9rem;
`;

const CheckboxGroup = styled.div`
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
`;

const CheckboxText = styled.span`
  color: #1a1a1a;
  font-size: 0.95rem;
`;

const Checkbox = styled.input`
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:checked {
    border-color: #ff9500;
    background-color: #ff9500;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
    background-size: 80%;
    background-position: center;
    background-repeat: no-repeat;
  }

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #ff9500;
    box-shadow: 0 0 0 3px rgba(255, 149, 0, 0.1);
  }
`;

export default Step2;