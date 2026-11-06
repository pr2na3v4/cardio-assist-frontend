/**
 * layouts/AppLayout.jsx
 * =======================
 * Shell for every in-app page: persistent Sidebar (desktop) / drawer
 * (mobile), a topbar with a mobile menu toggle and page title, and the
 * routed page content.
 */

import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function AppLayout({ title, description, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-surface-border bg-white/90 px-5 backdrop-blur-sm sm:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-ink-600 hover:bg-ink-50 lg:hidden"
            aria-label="Open navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div>
            <h1 className="font-display text-lg font-semibold text-ink-800 sm:text-xl">{title}</h1>
            {description && <p className="hidden text-xs text-ink-400 sm:block">{description}</p>}
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
