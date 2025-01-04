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
import { Button } from "../../components/ui/Button";

const OnBoarding = () => {
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

  // const handleCreateClick = () => {
  //   setIsCreateMeetingOpen(!isCreateMeetingOpen);
  //   // 슬라이드가 열릴 때 해당 섹션으로 부드럽게 스크롤
  //   if (!isCreateMeetingOpen) {
  //     setTimeout(() => {
  //       window.scrollTo({
  //         top: document.documentElement.scrollHeight,
  //         behavior: "smooth",
  //       });
  //     }, 100);
  //   }
  // };

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
                캠퍼스 라이프의 시간 관리를 더 스마트하게
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

export default OnBoarding;
