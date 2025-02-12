import { Link } from "react-router-dom";
import { GoogleLogin } from "../../api/auth/AuthAPI";
import styled from "styled-components";

const SignInModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent>
        <div onClick={() => GoogleLogin()}>구글 로그인으로 계속하기</div>
        <Link to="/meeting/create">
          <div>로그인 없이 하기</div>
        </Link>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export default SignInModal;
