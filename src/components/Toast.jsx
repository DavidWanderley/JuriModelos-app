import { useState, useEffect } from "react";

let showToastFunction = null;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    showToastFunction = showToast;
  }, []);

  return { toasts, showToast };
};

export const toast = {
  success: (message) => showToastFunction?.(message, "success"),
  error: (message) => showToastFunction?.(message, "error"),
  info: (message) => showToastFunction?.(message, "info"),
};

export default function Toast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-6 py-4 rounded-2xl shadow-xl font-bold text-white animate-in slide-in-from-right-5 ${
            t.type === "success"
              ? "bg-green-600"
              : t.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
