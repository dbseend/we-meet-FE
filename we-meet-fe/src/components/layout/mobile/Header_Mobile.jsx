import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { GoogleLogin } from "../../../api/auth/AuthAPI";
import styled from "styled-components";
import { Calendar, LogIn, Menu, User, X } from "lucide-react";

const Header_Mobile = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: "일정 생성", icon: Calendar, url: "/meeting/create" },
    { title: "마이페이지", icon: User, url: "/myPage" },
  ];

  const handleNavClick = (item) => {
    setIsOpen(false);
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <TopBar>
          <Link to="/">
            <Logo>
              <Title>Teampo</Title>
            </Logo>
          </Link>
          {user ? (
            <MobileButton onClick={() => setIsOpen(!isOpen)}>
              <IconWrapper as={isOpen ? X : Menu} />
            </MobileButton>
          ) : (
            <SignInButton 
            onClick={()=>GoogleLogin()}
            $primary>로그인</SignInButton>
          )}
        </TopBar>

        <MobileMenu $isOpen={isOpen}>
          <MenuContent>
            {navLinks.map(({ title, icon: Icon, url, onClick }) =>
              url ? (
                <NavLink
                  key={title}
                  to={url}
                >
                  <StyledIcon as={Icon} />
                  <span>{title}</span>
                </NavLink>
              ) : (
                <MenuItem
                  key={title}
                  onClick={() => handleNavClick({ onClick })}
                >
                  <StyledIcon as={Icon} />
                  <span>{title}</span>
                </MenuItem>
              )
            )}
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

const MenuItem = styled.div`
  // NavLink와 동일한 스타일 적용
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

const StyledIcon = styled.div`
  width: 1.25rem;
  height: 1.25rem;
`;

const SignInButton = styled.button`
  padding: ${(props) => (props.$large ? "1rem 2rem" : "0.5rem 1rem")};
  border-radius: 0.5rem;
  font-size: ${(props) => (props.$large ? "1.125rem" : "1rem")};
  font-weight: ${(props) => (props.$large ? "600" : "normal")};
  transition: all 0.2s;

  ${(props) =>
    props.$primary
      ? `
    background-color: #ff4548;
    color: white;
    &:hover { background-color: #ff4548; }
  `
      : `
    background-color: white;
    color: #ff4548;
    border: 2px solid #ff4548;
    &:hover { background-color: #fff1f1; }
  `}
`;

export default Header_Mobile;
