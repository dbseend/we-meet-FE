import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, variant },
    ]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`mb-2 p-4 rounded-md shadow-lg ${
            toast.variant === "destructive"
              ? "bg-red-500 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {toast.title && <div className="font-semibold">{toast.title}</div>}
          {toast.description && <div className="mt-1">{toast.description}</div>}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
}
