/**
 * pages/FollowUps.jsx
 * ======================
 * GET /followups/today and GET /followups power this page: today's
 * follow-ups first (most urgent), then the full upcoming list.
 */

import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import Seo from "../components/Seo";
import FollowupTable from "../components/tables/FollowupTable";
import ErrorState from "../components/ErrorState";
import { useFetch } from "../hooks/useFetch";
import { getFollowups, getTodaysFollowups } from "../services/api";

const TABS = [
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
];

export default function FollowUps() {
  const [tab, setTab] = useState("today");

  const { data: todays, loading: todaysLoading, error: todaysError, refetch: refetchTodays } = useFetch(getTodaysFollowups, []);
  const { data: upcoming, loading: upcomingLoading, error: upcomingError, refetch: refetchUpcoming } = useFetch(
    () => getFollowups({ limit: 200 }),
    []
  );

  const activeData = tab === "today" ? todays : upcoming;
  const activeLoading = tab === "today" ? todaysLoading : upcomingLoading;
  const activeError = tab === "today" ? todaysError : upcomingError;
  const activeRefetch = tab === "today" ? refetchTodays : refetchUpcoming;

  return (
    <AppLayout title="Follow-Ups" description="Today's and upcoming patient follow-ups, prioritized by risk.">
      <Seo title="Follow-Ups" description="Track today's and upcoming cardiac patient follow-ups, color-coded by risk level." path="/followups" />

      <div className="mb-5 flex items-center gap-2 rounded-full bg-ink-50 p-1" role="tablist" aria-label="Follow-up range">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-white text-ink-800 shadow-soft" : "text-ink-400 hover:text-ink-600"
            }`}
          >
            {t.label}
            {t.id === "today" && !todaysLoading && todays && (
              <span className="ml-1.5 rounded-full bg-pulse-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">{todays.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeError ? (
        <div className="card">
          <ErrorState message={activeError.message} onRetry={activeRefetch} />
        </div>
      ) : (
        <FollowupTable
          followups={activeData ?? []}
          loading={activeLoading}
          emptyTitle={tab === "today" ? "No follow-ups due today" : "No upcoming follow-ups"}
          emptyDescription={tab === "today" ? "Nothing scheduled for today — check back tomorrow." : "Run a prediction to schedule the next follow-up."}
        />
      )}
    </AppLayout>
  );
}
