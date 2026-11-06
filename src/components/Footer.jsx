/**
 * components/Footer.jsx
 * =======================
 * Marketing-site footer (public Home page only).
 */

import { Link } from "react-router-dom";
import PulseLine from "./PulseLine";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-white">
      <div className="section section-y !py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-700">
                <PulseLine variant="divider" className="h-3 w-6" color="#E33F5C" />
              </span>
              <span className="font-display text-lg font-semibold text-ink-800">CardioAssist AI</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-400">
              AI-powered cardiac risk segmentation, follow-up management, and healthcare assistant for care teams.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Patients", to: "/patients" },
              { label: "Predict Risk", to: "/predict" },
              { label: "Follow-Ups", to: "/followups" },
            ]}
          />
          <FooterCol
            title="Clinical"
            links={[
              { label: "Prediction History", to: "/history" },
              { label: "Risk Methodology", to: "/#how-it-works" },
              { label: "Care Team Guide", to: "/#features" },
            ]}
          />
          <FooterCol title="Company" links={[{ label: "Contact Care Ops", to: "/#" }, { label: "Privacy & HIPAA", to: "/#" }]} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-surface-border pt-6 text-xs text-ink-300 sm:flex-row">
          <p>© {new Date().getFullYear()} CardioAssist AI. For clinical decision support use only.</p>
          <p>Not a substitute for professional medical judgment.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-sm text-ink-400 hover:text-ink-700">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
