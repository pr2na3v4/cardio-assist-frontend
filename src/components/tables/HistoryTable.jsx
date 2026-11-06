/**
 * components/tables/HistoryTable.jsx
 * =====================================
 * Prediction history table: sortable by date, paginated, with a
 * "View details" action that opens a modal (wired in the History page).
 */

import RiskBadge from "../RiskBadge";
import EmptyState from "../EmptyState";
import { SkeletonTableRows } from "../Skeleton";
import { formatDateTime } from "../../utils/dateUtils";

export default function HistoryTable({ predictions, loading, pagination, onSort, sortDir, onViewDetails }) {
  if (loading) {
    return (
      <table className="w-full text-left text-sm">
        <TableHead onSort={onSort} sortDir={sortDir} />
        <tbody>
          <SkeletonTableRows rows={6} cols={5} />
        </tbody>
      </table>
    );
  }

  if (predictions.length === 0) {
    return <EmptyState title="No prediction history yet" description="Predictions you run will appear here for auditing and review." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <TableHead onSort={onSort} sortDir={sortDir} />
        <tbody>
          {pagination.pageItems.map((p) => (
            <tr key={p.id} className="border-b border-surface-border last:border-0 hover:bg-ink-50/50">
              <td className="px-4 py-3.5 font-medium text-ink-800">{p.risk_group}</td>
              <td className="px-4 py-3.5">
                <RiskBadge riskLevel={p.risk_level} size="sm" />
              </td>
              <td className="px-4 py-3.5 font-mono text-ink-600">#{p.cluster}</td>
              <td className="px-4 py-3.5 text-ink-400">{formatDateTime(p.created_at)}</td>
              <td className="px-4 py-3.5 text-right">
                <button onClick={() => onViewDetails(p)} className="text-sm font-medium text-ink-600 hover:text-pulse-600">
                  View details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHead({ onSort, sortDir }) {
  return (
    <thead>
      <tr className="border-b border-surface-border text-xs font-semibold uppercase tracking-wide text-ink-400">
        <th scope="col" className="px-4 py-3">Risk Group</th>
        <th scope="col" className="px-4 py-3">Risk Level</th>
        <th scope="col" className="px-4 py-3">Cluster</th>
        <th scope="col" className="px-4 py-3">
          <button onClick={onSort} className="flex items-center gap-1 hover:text-ink-700">
            Date {sortDir === "desc" ? "↓" : "↑"}
          </button>
        </th>
        <th scope="col" className="px-4 py-3 text-right">Details</th>
      </tr>
    </thead>
  );
}
