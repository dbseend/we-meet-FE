import React from "react";
import { useNavigation } from "../hooks/useNavigation";

const Navigation = () => {
  const { baseClasses, isMobile } = useNavigation();

  const navLinks = useMemo(
    () => [
      { title: "일정 생성", icon: Calendar },
      { title: "마이페이지", icon: User },
      { title: "알림센터", icon: Bell },
      { title: "설정", icon: Settings },
    ],
    []
  );

  return (
    <nav
      className={isMobile ? "py-2" : "hidden md:flex items-center space-x-8"}
    >
      {navLinks.map(({ title, icon: Icon }) => (
        <a key={title} href="#" className={baseClasses}>
          <Icon className="w-5 h-5" />
          <span>{title}</span>
        </a>
      ))}
    </nav>
  );
};

export default Navigation;
