import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, Users, Video, ArrowRight, ArrowLeft } from 'lucide-react';

const CORAL = '#FF5F62';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF1F1 0%, #FFFFFF 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
`;

const Steps = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  color: ${props => props.$active ? CORAL : '#9CA3AF'};
  font-weight: ${props => props.$active ? '600' : '400'};
  
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: ${props => props.$active ? CORAL : '#E5E7EB'};
    margin-top: 0.5rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1F2937;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: ${CORAL};
    box-shadow: 0 0 0 3px rgba(255, 95, 98, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${CORAL};
    box-shadow: 0 0 0 3px rgba(255, 95, 98, 0.1);
  }
`;

const TimeInputGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  appearance: none;
  width: 3rem;
  height: 1.5rem;
  background: #E5E7EB;
  border-radius: 1rem;
  position: relative;
  transition: all 0.3s;
  
  &:checked {
    background: ${CORAL};
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: white;
    top: 0.125rem;
    left: 0.125rem;
    transition: all 0.3s;
  }
  
  &:checked::before {
    left: 1.625rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  ${props => props.$primary ? `
    background-color: ${CORAL};
    color: white;
    &:hover { background-color: #ff4548; }
  ` : props.$secondary ? `
    background-color: white;
    color: ${CORAL};
    border: 2px solid ${CORAL};
    &:hover { background-color: #fff1f1; }
  ` : `
    color: #6B7280;
    &:hover { color: #374151; }
  `}
`;

const MeetingCreation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    deadline: '',
    participants: '',
    isOnline: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderStep1 = () => (
    <Form onSubmit={(e) => {
      e.preventDefault();
      setStep(2);
    }}>
      <FormGroup>
        <Label>제목</Label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="회의 제목을 입력하세요"
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>설명</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="회의 설명을 입력하세요"
        />
      </FormGroup>
      
      <FormGroup>
        <Label>날짜</Label>
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <ButtonGroup>
        <div></div>
        <Button type="submit" $primary>
          다음
          <ArrowRight size={20} />
        </Button>
      </ButtonGroup>
    </Form>
  );

  const renderStep2 = () => (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormGroup>
        <Label>시간 범위</Label>
        <TimeInputGroup>
          <Input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
          <Input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </TimeInputGroup>
      </FormGroup>
      
      <FormGroup>
        <Label>투표 마감</Label>
        <Input
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>참석 인원</Label>
        <Input
          type="number"
          name="participants"
          value={formData.participants}
          onChange={handleChange}
          placeholder="예상 참석 인원을 입력하세요"
          min="2"
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Toggle>
          <ToggleInput
            type="checkbox"
            name="isOnline"
            checked={formData.isOnline}
            onChange={handleChange}
          />
          화상 회의 생성
        </Toggle>
      </FormGroup>

      <ButtonGroup>
        <Button type="button" onClick={() => setStep(1)}>
          <ArrowLeft size={20} />
          이전
        </Button>
        <Button type="submit" $primary>
          회의 생성
          <ArrowRight size={20} />
        </Button>
      </ButtonGroup>
    </Form>
  );

  return (
    <Container>
      <Card>
        <Steps>
          <Step $active={step >= 1}>기본 정보</Step>
          <Step $active={step >= 2}>상세 정보</Step>
        </Steps>
        <Title>{step === 1 ? '기본 정보 입력' : '상세 정보 입력'}</Title>
        {step === 1 ? renderStep1() : renderStep2()}
      </Card>
    </Container>
  );
};

export default MeetingCreation;