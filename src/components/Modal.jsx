/**
 * components/Modal.jsx
 * ======================
 * Accessible modal dialog: closes on Escape or overlay click, proper ARIA
 * roles for screen readers. Used by the History page's "View Details" action.
 */

import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-up" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl2 bg-white p-6 shadow-lift animate-fade-up focus:outline-none"
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 id="modal-title" className="font-display text-xl font-semibold text-ink-800">
            {title}
          </h2>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-full p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
