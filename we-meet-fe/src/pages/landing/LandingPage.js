import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import GoogleLogin from "../../components/auth/GoogleLogin";
import CreateMeetingPage from "../meeting/create/CreateMeetingPage";
import {
  MaxWidthContainer,
  PageContainer,
  SectionContainer,
} from "../../styles/Container.styles";
import { Flex } from "../../styles/Flex.styles";
import { SlideContainer } from "../../styles/SlideContainer.styles";
import { MainContent } from "../../styles/Layout.styles";
import { Heading, Text } from "../../styles/Typography.styles";
import { Button } from "../../components/common/Button";

const LandingPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User logged in:", user);
    } else {
      console.log("No user");
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCreateClick = () => {
    navigate("/meeting/create");
  };

  return (
    <PageContainer>
      <MainContent>
        <MaxWidthContainer>
          <SectionContainer>
            <Flex>
              <Heading level={1}>WE-MEET</Heading>
              <Heading level={3}>
                여러 캘린더가 하나로, 복잡한 일정이 단순하게. 스마트한 팀을 위한
                스마트한 선택.
              </Heading>
              {!user ? (
                <GoogleLogin />
              ) : (
                <>
                  <Text>{user.user_metadata.name}님 환영합니다!</Text>
                  <Button onClick={handleSignOut}>로그아웃</Button>
                </>
              )}
              <Button onClick={handleCreateClick}>
                {isCreateMeetingOpen ? "닫기" : "미팅 생성하기"}
              </Button>
              {user ? (
                <>
                  <Button>미팅 조회하기</Button>
                  <Button>플랫폼 연동하기</Button>
                </>
              ) : (
                <></>
              )}
            </Flex>
            <SlideContainer isOpen={isCreateMeetingOpen}>
              <CreateMeetingPage />
            </SlideContainer>{" "}
          </SectionContainer>
        </MaxWidthContainer>
      </MainContent>
    </PageContainer>
  );
};

export default LandingPage;
