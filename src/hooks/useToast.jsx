/**
 * hooks/useToast.jsx
 * ===================
 * Lightweight toast notification system. Provides <ToastProvider> to wrap
 * the app and a useToast() hook exposing success/error/info helpers, used
 * for API success and failure feedback across every page.
 */

import React, { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, variant = "info", duration = 4500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, variant }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const toast = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed bottom-5 right-5 z-[100] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              "animate-fade-up rounded-xl border px-4 py-3.5 text-sm font-medium shadow-lift backdrop-blur-sm",
              t.variant === "success" && "border-risk-healthy/30 bg-risk-healthy-bg text-ink-800",
              t.variant === "error" && "border-risk-critical/30 bg-risk-critical-bg text-ink-800",
              t.variant === "info" && "border-ink-200 bg-white text-ink-800",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={[
                  "mt-0.5 h-2 w-2 flex-shrink-0 rounded-full",
                  t.variant === "success" && "bg-risk-healthy",
                  t.variant === "error" && "bg-risk-critical",
                  t.variant === "info" && "bg-ink-500",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
              />
              <p className="flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-ink-300 hover:text-ink-600"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
