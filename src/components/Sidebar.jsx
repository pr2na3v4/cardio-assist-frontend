/**
 * components/Sidebar.jsx
 * ========================
 * Persistent in-app navigation for the clinical pages (Dashboard, Patients,
 * Predict, Follow-Ups, History). Refactored to fix:
 *  - Mobile drawer now sits *under* the navbar (top-16) instead of overlapping it
 *  - Desktop uses sticky positioning so it stretches the full viewport height
 *    without relying on `lg:static` which breaks flex layout stretching
 *  - Navigation scrolls independently when items overflow
 *  - Replaced custom Tailwind colors (ink, pulse, surface) with standard slate/emerald
 *  - Fixed invalid `h-4.5` utility classes
 *  - Replaced external PulseLine dependency with inline heartbeat icon
 */

import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/patients", label: "Patients", icon: PatientsIcon },
  { to: "/predict", label: "Predict", icon: PredictIcon },
  { to: "/followups", label: "Follow-Ups", icon: FollowupIcon },
  { to: "/history", label: "History", icon: HistoryIcon },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay — dismisses drawer when clicking outside */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          /* Mobile: fixed drawer, starts below 64px navbar, occupies remaining height */
          "fixed top-16 left-0 z-40 flex w-64 flex-col border-r border-slate-700 bg-slate-900 text-white transition-transform duration-200 ease-in-out",
          "h-[calc(100vh-4rem)]",

          /* Desktop: sticky in normal flow, full viewport height, never hidden */
          "lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0",

          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Main navigation"
      >
        {/* Brand header — shrink-0 prevents it from squashing */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <HeartbeatIcon className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight">CardioAssist AI</span>
        </div>

        {/* Nav links — flex-1 fills available space, overflow-y-auto prevents breaking out */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Sections">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info card — mt-auto pushes it to bottom in flex-col */}
        <div className="mx-3 mb-5 mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium text-slate-400">Care Team</p>
          <p className="mt-1 text-sm font-semibold text-white">Cardiology Dept.</p>
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Inline icon set (no external icon library dependency)
// ---------------------------------------------------------------------------

function HeartbeatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path
        d="M3 12h3l2-5 3 10 2-6 2 4h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PatientsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <circle cx="9" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2.5 20a6.5 6.5 0 0113 0M16 8.5a3 3 0 110-6M15 14a5.5 5.5 0 016.5 5.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PredictIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path
        d="M3 13h4l2-6 4 12 2-8 2 4h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FollowupIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 3v3M16 3v3M3.5 9.5h17M8 14l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path
        d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3M3 4v4h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}