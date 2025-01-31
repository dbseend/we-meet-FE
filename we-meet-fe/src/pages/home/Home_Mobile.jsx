import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "../../api/auth/AuthAPI";
import { ArrowRight, Calendar, Clock, Users } from 'lucide-react';
import styled from "styled-components";

const Home_Mobile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStart = async() =>{
    if(user){
      navigate("/meeting/create");
    } else{
      GoogleLogin();
    }
  }


  return (
    <PageContainer>
      <HeroSection>
        <MaxWidthContainer>
          <HeroContent>
            <ContentLeft>
              <MainHeading>
                일정 조율,<br />
                <span>한번에</span> 해결하세요
              </MainHeading>
              <SubHeading>
                팀 일정 조율부터 화상회의까지<br />
                Teampo 하나로 충분합니다
              </SubHeading>
              
              <ButtonGroup>
                <StyledButton 
                onClick={()=>handleStart()}
                $primary $large>
                  시작하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </StyledButton>
                {/* <StyledButton $large>
                  자세히 알아보기
                </StyledButton> */}
              </ButtonGroup>

              <FeaturesGrid>
                <FeatureCard>
                  <IconWrapper>
                    <Calendar size={24} />
                  </IconWrapper>
                  <p>간편한 일정 조율</p>
                </FeatureCard>
                <FeatureCard>
                  <IconWrapper>
                    <Users size={24} />
                  </IconWrapper>
                  <p>실시간 팀 동기화</p>
                </FeatureCard>
                <FeatureCard>
                  <IconWrapper>
                    <Clock size={24} />
                  </IconWrapper>
                  <p>AI 시간 추천</p>
                </FeatureCard>
              </FeaturesGrid>
            </ContentLeft>
          </HeroContent>
        </MaxWidthContainer>
      </HeroSection>
    </PageContainer>
  );
};

const CORAL = '#FF5F62';

const PageContainer = styled.div`
  min-h-screen bg-gradient-to-b from-red-50 to-white
`;

const MaxWidthContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.$large ? '1rem 2rem' : '0.5rem 1rem'};
  border-radius: 0.5rem;
  font-size: ${props => props.$large ? '1.125rem' : '1rem'};
  font-weight: ${props => props.$large ? '600' : 'normal'};
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
`;

const HeroSection = styled.div`
  // min-height: 100vh;
  // padding-top: 4rem;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  // padding-top: 2rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
  }
`;

const ContentLeft = styled.div`
  flex: 1;
  text-align: center;

  @media (min-width: 1024px) {
    text-align: left;
  }
`;

const MainHeading = styled.h1`
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;

  span {
    color: ${CORAL};
  }
`;

const SubHeading = styled.p`
  font-size: 1.25rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.75;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;

  @media (min-width: 640px) {
    flex-direction: row;
  }

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
`;

const FeaturesGrid = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled.div`
  color: ${CORAL};
  flex-shrink: 0;
`;

const ImageSection = styled.div`
  flex: 1;
  width: 100%;
  max-width: 32rem;
`;

const ImageContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  aspect-ratio: 1;
`;

const ImageInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 95, 98, 0.1);
`;

export default Home_Mobile;
