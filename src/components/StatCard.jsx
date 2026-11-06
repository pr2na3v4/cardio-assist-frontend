/**
 * components/StatCard.jsx
 * =========================
 * Dashboard analytics card: label, big number, optional sub-label, and an
 * accent color tied to the metric's clinical meaning.
 */

export default function StatCard({ label, value, sublabel, accent = "ink", icon, loading }) {
  const accentClasses = {
    ink: "text-ink-700 bg-ink-50",
    healthy: "text-risk-healthy bg-risk-healthy-bg",
    moderate: "text-risk-moderate bg-risk-moderate-bg",
    high: "text-risk-high bg-risk-high-bg",
    critical: "text-risk-critical bg-risk-critical-bg",
    pulse: "text-pulse-600 bg-pulse-50",
  }[accent];

  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton mb-3 h-4 w-24" />
        <div className="skeleton h-8 w-16" />
      </div>
    );
  }

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-ink-400">{label}</p>
        {icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentClasses}`} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-ink-800">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-ink-400">{sublabel}</p>}
    </div>
  );
}
