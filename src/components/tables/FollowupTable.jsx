/**
 * components/tables/FollowupTable.jsx
 * ======================================
 * Follow-up list: color-coded by risk level, with a live countdown/overdue
 * indicator. Rendered as cards (not a dense table) since follow-ups are a
 * task list clinicians act on, not just data to scan.
 */

import RiskBadge from "../RiskBadge";
import EmptyState from "../EmptyState";
import { followupCountdown, formatDate } from "../../utils/dateUtils";
import { getRiskMeta } from "../../utils/riskUtils";

// The /followups list doesn't include risk_level directly (only risk_group
// text), so we infer level from the group name for consistent coloring.
function levelFromGroup(riskGroup = "") {
  if (riskGroup.includes("Critical")) return "Critical";
  if (riskGroup.includes("Hypertension") || riskGroup.includes("Senior")) return "High";
  if (riskGroup.includes("Cholesterol")) return "Moderate";
  return "Low";
}

export default function FollowupTable({ followups, loading, emptyTitle, emptyDescription }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton mb-2 h-4 w-40" />
            <div className="skeleton h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (followups.length === 0) {
    return <EmptyState title={emptyTitle || "Nothing scheduled"} description={emptyDescription} />;
  }

  return (
    <div className="space-y-3">
      {followups.map((f) => {
        const level = levelFromGroup(f.risk_group);
        const meta = getRiskMeta(level);
        const countdown = followupCountdown(f.next_followup_date);

        return (
          <div key={f.id} className={`card flex flex-col gap-3 border-l-4 p-5 sm:flex-row sm:items-center sm:justify-between`} style={{ borderLeftColor: meta.chart }}>
            <div className="flex items-center gap-4">
              <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${meta.bgClass} ${meta.textClass} font-mono text-sm font-semibold`}>
                {f.patient_id ? String(f.patient_id).slice(0, 2).toUpperCase() : "—"}
              </span>
              <div>
                <p className="font-medium text-ink-800">{f.risk_group}</p>
                <p className="text-xs text-ink-400">Scheduled for {formatDate(f.next_followup_date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
              <RiskBadge riskLevel={level} size="sm" />
              <span className={`text-xs font-semibold ${countdown.overdue ? "text-risk-critical" : "text-ink-500"}`}>
                {countdown.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
