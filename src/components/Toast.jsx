"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

// Context Setup
const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // 🔔 Add toast dynamically
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-s24 right-s24 flex flex-col gap-s8 z-[9999]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-s8 rounded-r8 shadow-lg p-s16 text-background transition-all duration-300 ${
              t.type === "success" ? "bg-primary-main" : "bg-red-main"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <span className="body-small">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ✅ Hook for usage in components
export function useToast() {
  return useContext(ToastContext);
}
