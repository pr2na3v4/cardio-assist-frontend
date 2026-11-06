/**
 * components/Navbar.jsx
 * =======================
 * Marketing-site navbar (public Home page only). In-app pages use the
 * Sidebar instead - see layouts/AppLayout.jsx.
 *
 * Layout note: this uses a fixed 3-column grid (brand / nav / CTA) instead
 * of a plain flex `justify-between` row. The previous version showed the
 * 5 nav links at `md:` (768px) but the CTA button at `sm:` (640px), so
 * between ~768-1024px all three regions competed for space in an
 * unconstrained flex row and the nav links overflowed past the container.
 * Gating both the nav links and the CTA behind the same breakpoint (`lg:`)
 * and giving each region shrink/wrap protection fixes that.
 */

import { Link, NavLink } from "react-router-dom";
import PulseLine from "./PulseLine";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/patients", label: "Patients" },
  { to: "/predict", label: "Predict" },
  { to: "/followups", label: "Follow-Ups" },
  { to: "/history", label: "History" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/40">
      <nav
        className="section grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4"
        aria-label="Primary"
      >
        {/* ---- Brand (fixed width, never shrinks/wraps) ---- */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-2" aria-label="CardioAssist AI home">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-ink-700">
            <PulseLine variant="divider" className="h-3 w-6" color="#E33F5C" />
          </span>
          <span className="whitespace-nowrap font-display text-lg font-semibold text-ink-800">
            CardioAssist AI
          </span>
        </Link>

        {/* ---- Nav links (center column: takes remaining space, can scroll
               instead of overflow if it's ever still too tight) ---- */}
        <div className="hidden min-w-0 items-center justify-center gap-1 overflow-x-auto lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors xl:px-4 ${
                  isActive ? "bg-ink-700 text-white" : "text-ink-600 hover:bg-ink-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* ---- CTA (fixed width, never shrinks/wraps; gated at the same
               breakpoint as the nav links so they appear together) ---- */}
        <Link to="/predict" className="btn-accent btn-sm hidden flex-shrink-0 whitespace-nowrap lg:inline-flex">
          Predict Patient Risk
        </Link>
      </nav>
    </header>
  );
}