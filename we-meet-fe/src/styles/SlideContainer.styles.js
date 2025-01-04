import styled from 'styled-components';

export const SlideContainer = styled.div`
  height: ${({ isOpen }) => (isOpen ? 'auto' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-20px')});
  transition: all 0.3s ease-in-out;
  overflow: hidden;
`;