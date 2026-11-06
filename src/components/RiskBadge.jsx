/**
 * components/RiskBadge.jsx
 * ==========================
 * Color-coded risk level badge used across Dashboard, Follow-ups, History,
 * and Prediction results.
 */

import { getRiskMeta } from "../utils/riskUtils";

export default function RiskBadge({ riskLevel, size = "md" }) {
  const meta = getRiskMeta(riskLevel);
  const sizeClasses = size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${meta.textClass} ${meta.bgClass} ${sizeClasses}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
