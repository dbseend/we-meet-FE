import { Bell, Calendar, Settings, User } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Header_Desktop = () => {

  const navLinks = [
    { title: "일정 생성", icon: Calendar, url: "/create" },
    { title: "마이페이지", icon: User, url: "/myPage" },
    { title: "알림센터", icon: Bell, url: "/" },
    { title: "설정", icon: Settings, url:"/settings" },
  ];

  return (
    <HeaderContainer>
      <Nav>
        <Link to="/">
        <Logo>
          <Title>스케줄러</Title>
        </Logo>
        </Link>

        <DesktopNav>
          {navLinks.map(({ title, icon: Icon, url }) => (
              <Link key={title} to={url}>
              <StyledIcon as={Icon} />
              <span>{title}</span>
            </Link>
          ))}
        </DesktopNav>
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

const Logo = styled.div`
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
`;

const DesktopNav = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    gap: 2rem;
  }
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #4b5563;
  &:hover {
    color: #111827;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const StyledIcon = styled.div`
  width: 1.25rem;
  height: 1.25rem;
`;

export default Header_Desktop;
