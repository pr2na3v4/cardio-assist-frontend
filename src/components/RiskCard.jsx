/**
 * components/RiskCard.jsx
 * =========================
 * Displays a prediction result: Risk Group, Risk Level, Cluster,
 * Recommendation, and Next Follow-Up Date. Reads the exact nested shape
 * returned by POST /predict: { prediction, followup, reminder }.
 */

import RiskBadge from "./RiskBadge";
import PulseLine from "./PulseLine";
import { formatDate } from "../utils/dateUtils";
import { getRiskMeta } from "../utils/riskUtils";

export default function RiskCard({ result }) {
  if (!result) return null;
  const { prediction, followup } = result;
  const meta = getRiskMeta(prediction.risk_level);

  return (
    <div className="card overflow-hidden">
      <div className={`flex items-center justify-between px-6 py-5 ${meta.bgClass}`}>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Prediction result</p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-ink-800">{prediction.risk_group}</h3>
        </div>
        <RiskBadge riskLevel={prediction.risk_level} />
      </div>

      <PulseLine variant="divider" className="h-6 w-full px-6 opacity-40" color={meta.chart} />

      <div className="grid grid-cols-2 gap-6 px-6 pb-6 sm:grid-cols-4">
        <Metric label="Cluster" value={`#${prediction.cluster}`} />
        <Metric label="Risk Level" value={prediction.risk_level} />
        <Metric label="Follow-up every" value={`${followup.followup_frequency_days}d`} />
        <Metric label="Next follow-up" value={formatDate(followup.next_followup_date)} />
      </div>

      <div className="border-t border-surface-border bg-ink-50/50 px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Recommendation</p>
        <p className="mt-1.5 text-sm text-ink-700">{prediction.recommendation}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold text-ink-800">{value}</p>
    </div>
  );
}
