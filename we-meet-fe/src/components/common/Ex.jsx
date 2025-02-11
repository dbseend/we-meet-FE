import { useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Toast from "./Toast";

// Example Usage
const Ex = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toasts, setToasts] = useState([]);
  
    const showToast = (message, type = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
    };
  
    const removeToast = (id) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    };
  
    return (
      <div>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        <button onClick={() => showToast('This is a success message', 'success')}>
          Show Success Toast
        </button>
  
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Modal Title</h2>
          <p>This is the modal content.</p>
        </Modal>
  
        <ToastContainer>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </ToastContainer>
      </div>
    );
  };

  const ToastContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
`;

export default Ex;