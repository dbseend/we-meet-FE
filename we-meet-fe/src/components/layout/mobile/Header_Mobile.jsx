import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Menu, X, Bell, Calendar, User, Settings } from "lucide-react";

const Header_Mobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: "일정 생성", icon: Calendar, url: "/meeting/create" },
    { title: "마이페이지", icon: User, url: "/myPage" },
    { title: "알림센터", icon: Bell, url: "/" },
    { title: "설정", icon: Settings, url: "/settings" },
  ];

  return (
    <HeaderContainer>
      <Nav>
        <TopBar>
          <Link to="/">
            <Logo>
              <Title>스케줄러</Title>
            </Logo>
          </Link>
          <MobileButton onClick={() => setIsOpen(!isOpen)}>
            <IconWrapper as={isOpen ? X : Menu} />
          </MobileButton>
        </TopBar>

        <MobileMenu $isOpen={isOpen}>
          <MenuContent>
            {navLinks.map(({ title, icon: Icon, url }) => (
              <NavLink key={title} to={url} onClick={() => setIsOpen(!isOpen)}>
                <StyledIcon as={Icon} />
                <span>{title}</span>
              </NavLink>
            ))}
          </MenuContent>
        </MobileMenu>
      </Nav>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  z-index: 50;
`;

const Nav = styled.nav`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
`;

const Logo = styled.div`
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
`;

const MobileButton = styled.button`
  color: #4b5563;
  &:hover {
    color: #111827;
  }
  @media (min-width: 768px) {
    display: none;
  }
`;

const IconWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
`;

const MobileMenu = styled.div`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  @media (min-width: 768px) {
    display: none;
  }
`;

const MenuContent = styled.div`
  padding: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.75rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  color: #4b5563;
  margin-bottom: 0.25rem;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const StyledIcon = styled.div`
  width: 1.25rem;
  height: 1.25rem;
`;

export default Header_Mobile;
