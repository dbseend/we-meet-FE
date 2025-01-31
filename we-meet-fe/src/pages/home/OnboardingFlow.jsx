import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowRight, Camera, Calendar, Mail } from 'lucide-react';

const CORAL = '#FF5F62';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(180deg, #FFF1F1 0%, #FFFFFF 100%);
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  padding: 2rem;
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  flex: 1;
  height: 4px;
  background: ${props => props.$active ? CORAL : '#E5E7EB'};
  margin: 0 4px;
  transition: background 0.3s;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1F2937;
  margin-bottom: 1rem;
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem;
  border-radius: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  ${props => props.$primary ? `
    background-color: ${CORAL};
    color: white;
    &:hover { background-color: #ff4548; }
  ` : `
    background-color: white;
    color: ${CORAL};
    border: 2px solid ${CORAL};
    &:hover { background-color: #fff1f1; }
  `}
  
  margin-bottom: ${props => props.$mb ? '1rem' : '0'};
`;

const SkipButton = styled.button`
  color: #6B7280;
  font-size: 0.875rem;
  margin-top: 1rem;
  
  &:hover {
    color: #374151;
  }
`;

const ImageUpload = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  cursor: pointer;
  
  &:hover {
    background: #E5E7EB;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${CORAL};
    box-shadow: 0 0 0 3px rgba(255, 95, 98, 0.1);
  }
`;

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [skipped, setSkipped] = useState(false);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <Title>간편하게 시작하기</Title>
            <Button $primary $mb onClick={() => setStep(2)}>
              <Mail size={20} />
              구글로 계속하기
            </Button>
            <Button onClick={() => setStep(2)}>
              <Mail size={20} />
              이메일로 계속하기
            </Button>
            <SkipButton onClick={() => {
              setSkipped(true);
              setStep(2);
            }}>
              건너뛰기
            </SkipButton>
          </>
        );
      case 2:
        return (
          <>
            <Title>프로필 설정</Title>
            <ImageUpload>
              <Camera size={32} color="#6B7280" />
            </ImageUpload>
            <Input placeholder="이름" />
            <Button $primary onClick={() => setStep(3)}>
              다음
              <ArrowRight size={20} />
            </Button>
            {!skipped && (
              <SkipButton onClick={() => setStep(3)}>
                건너뛰기
              </SkipButton>
            )}
          </>
        );
      case 3:
        return (
          <>
            <Title>일정 만들기</Title>
            <Input placeholder="일정 제목" />
            <Button $primary>
              <Calendar size={20} />
              일정 생성하기
            </Button>
          </>
        );
    }
  };

  return (
    <Container>
      <Card>
        <ProgressBar>
          <Step $active={step >= 1} />
          <Step $active={step >= 2} />
          <Step $active={step >= 3} />
        </ProgressBar>
        {renderStep()}
      </Card>
    </Container>
  );
};

export default OnboardingFlow;