/**
 * pages/History.jsx
 * ====================
 * GET /history powers this page: search by risk group, filter by risk
 * level, sort by date, paginate, and view full details in a modal.
 */

import { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import Seo from "../components/Seo";
import HistoryTable from "../components/tables/HistoryTable";
import Pagination from "../components/Pagination";
import ErrorState from "../components/ErrorState";
import Modal from "../components/Modal";
import RiskBadge from "../components/RiskBadge";
import { useFetch } from "../hooks/useFetch";
import { usePagination } from "../hooks/usePagination";
import { getHistory } from "../services/api";
import { formatDateTime } from "../utils/dateUtils";

const RISK_FILTERS = ["All", "Low", "Moderate", "High", "Critical"];

export default function History() {
  const { data: predictions, loading, error, refetch } = useFetch(() => getHistory({ limit: 500 }), []);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (!predictions) return [];
    let list = [...predictions];

    if (riskFilter !== "All") {
      list = list.filter((p) => p.risk_level === riskFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.risk_group.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const diff = new Date(a.created_at) - new Date(b.created_at);
      return sortDir === "desc" ? -diff : diff;
    });

    return list;
  }, [predictions, search, riskFilter, sortDir]);

  const pagination = usePagination(filtered, 8);

  return (
    <AppLayout title="Prediction History" description="Every risk prediction ever generated, searchable and auditable.">
      <Seo title="Prediction History" description="Full audit trail of cardiac risk predictions and their outcomes." path="/history" />

      <div className="card">
        <div className="flex flex-col gap-3 border-b border-surface-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-800">Prediction history</h2>
            <p className="text-xs text-ink-400">
              {filtered.length} prediction{filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative sm:w-56">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  pagination.resetPage();
                }}
                placeholder="Search by risk group"
                aria-label="Search prediction history"
                className="field-input pl-9"
              />
            </div>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                pagination.resetPage();
              }}
              aria-label="Filter by risk level"
              className="field-input sm:w-40"
            >
              {RISK_FILTERS.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All risk levels" : r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <ErrorState message={error.message} onRetry={refetch} />
        ) : (
          <>
            <HistoryTable
              predictions={filtered}
              loading={loading}
              pagination={pagination}
              sortDir={sortDir}
              onSort={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
              onViewDetails={setSelected}
            />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onPrev={pagination.prevPage} onNext={pagination.nextPage} />
          </>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Prediction details">
        {selected && (
          <dl className="space-y-4 text-sm">
            <Row label="Risk Group" value={selected.risk_group} />
            <Row label="Risk Level" value={<RiskBadge riskLevel={selected.risk_level} size="sm" />} />
            <Row label="Cluster" value={`#${selected.cluster}`} mono />
            <Row label="Recommendation" value={selected.recommendation} />
            <div className="grid grid-cols-2 gap-4 border-t border-surface-border pt-4">
              <Row label="Age" value={selected.age} mono />
              <Row label="Blood Pressure" value={selected.trestbps} mono />
              <Row label="Cholesterol" value={selected.chol} mono />
              <Row label="Max Heart Rate" value={selected.thalach} mono />
              <Row label="OldPeak" value={selected.oldpeak} mono />
              <Row label="Recorded" value={formatDateTime(selected.created_at)} />
            </div>
          </dl>
        )}
      </Modal>
    </AppLayout>
  );
}

function Row({ label, value, mono }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className={`mt-1 text-ink-800 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
