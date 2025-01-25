import React, { useState } from 'react';
import { Menu, X, Bell, Calendar, User, Settings } from 'lucide-react';

const Header_Desktop = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: '일정 생성', icon: Calendar },
    { title: '마이페이지', icon: User },
    { title: '알림센터', icon: Bell },
    { title: '설정', icon: Settings }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">스케줄러</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(({ title, icon: Icon }) => (
              <a
                key={title}
                href="#"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <Icon className="w-5 h-5" />
                <span>{title}</span>
              </a>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(({ title, icon: Icon }) => (
                <a
                  key={title}
                  href="#"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <Icon className="w-5 h-5" />
                  <span>{title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header_Desktop;