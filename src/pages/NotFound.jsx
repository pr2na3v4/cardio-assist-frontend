/**
 * pages/NotFound.jsx
 * =====================
 * 404 page for unmatched routes. Kept on-brand and helpful rather than a
 * dead end - offers direct links back into the app.
 */

import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import PulseLine from "../components/PulseLine";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-800 px-6 text-center">
      <Seo title="Page not found" description="The page you're looking for doesn't exist." path="/404" />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pulse-500/15">
        <PulseLine variant="loader" className="h-6 w-14" color="#E33F5C" />
      </span>
      <h1 className="mt-6 font-display text-5xl font-semibold text-white">404</h1>
      <p className="mt-2 text-lg text-ink-100/70">This page went flat-line — it doesn't exist.</p>
      <p className="mt-1 max-w-sm text-sm text-ink-100/50">
        The page you're looking for may have been moved or the link might be incorrect.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-accent">
          Back to home
        </Link>
        <Link to="/dashboard" className="btn bg-white/10 text-white hover:bg-white/15">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
