/**
 * pages/Dashboard.jsx
 * =====================
 * GET /dashboard/stats + GET /followups power this page.
 *
 * Cards (as specified): Total Patients, Healthy Patients, High Risk
 * Patients, Critical Patients, Today's Follow-Ups. Moderate Risk is added
 * as a sixth card since the backend already computes it and omitting it
 * would leave a gap in the four-level risk color system used everywhere
 * else in the app (Healthy/Moderate/High/Critical).
 *
 * Charts: Risk Distribution (donut), Patient Distribution (bar, by
 * cluster/risk group), Follow-Up Analytics (line, next 7 days).
 */

import AppLayout from "../layouts/AppLayout";
import Seo from "../components/Seo";
import StatCard from "../components/StatCard";
import ErrorState from "../components/ErrorState";
import RiskDistributionChart from "../components/charts/RiskDistributionChart";
import PatientDistributionChart from "../components/charts/PatientDistributionChart";
import FollowupAnalyticsChart from "../components/charts/FollowupAnalyticsChart";
import { useFetch } from "../hooks/useFetch";
import { getDashboardStats, getFollowups, getTodaysFollowups } from "../services/api";

export default function Dashboard() {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch(getDashboardStats, []);
  const { data: todays, loading: todaysLoading } = useFetch(getTodaysFollowups, []);
  const { data: followups, loading: followupsLoading } = useFetch(() => getFollowups({ limit: 200 }), []);

  const loading = statsLoading;

  return (
    <AppLayout title="Dashboard" description="A live view of patient risk mix and follow-up workload.">
      <Seo title="Dashboard" description="Live cardiac risk dashboard: patient census, risk distribution, and follow-up workload." path="/dashboard" />

      {statsError ? (
        <div className="card">
          <ErrorState message={statsError.message} onRetry={refetchStats} />
        </div>
      ) : (
        <>
          {/* ---- Stat cards ---- */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Total Patients" value={stats?.total_patients ?? "—"} accent="ink" loading={loading} icon={<UsersIcon />} />
            <StatCard label="Healthy Patients" value={stats?.healthy_patients ?? "—"} accent="healthy" loading={loading} icon={<CheckIcon />} />
            <StatCard label="Moderate Risk" value={stats?.moderate_risk_patients ?? "—"} accent="moderate" loading={loading} icon={<AlertIcon />} />
            <StatCard label="High Risk Patients" value={stats?.high_risk_patients ?? "—"} accent="high" loading={loading} icon={<AlertIcon />} />
            <StatCard label="Critical Patients" value={stats?.critical_patients ?? "—"} accent="critical" loading={loading} icon={<PulseIcon />} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              label="Today's Follow-Ups"
              value={todaysLoading ? "—" : todays?.length ?? 0}
              accent="pulse"
              loading={todaysLoading}
              icon={<CalendarIcon />}
              sublabel="Due before end of day"
            />
            <StatCard
              label="Upcoming Follow-Ups"
              value={stats?.upcoming_followups ?? "—"}
              accent="ink"
              loading={loading}
              icon={<ClockIcon />}
              sublabel="Scheduled and pending"
            />
          </div>

          {/* ---- Charts ---- */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="font-display text-base font-semibold text-ink-800">Risk Distribution</h2>
              <p className="text-xs text-ink-400">Patients by most recent risk level</p>
              <div className="mt-4">
                {loading ? (
                  <div className="skeleton h-72 w-full" />
                ) : (
                  <RiskDistributionChart
                    healthy={stats?.healthy_patients ?? 0}
                    moderate={stats?.moderate_risk_patients ?? 0}
                    high={stats?.high_risk_patients ?? 0}
                    critical={stats?.critical_patients ?? 0}
                  />
                )}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-display text-base font-semibold text-ink-800">Patient Distribution</h2>
              <p className="text-xs text-ink-400">Predictions by cardiac risk group</p>
              <div className="mt-4">
                {loading ? <div className="skeleton h-72 w-full" /> : <PatientDistributionChart predictionsByCluster={stats?.predictions_by_cluster ?? {}} />}
              </div>
            </div>

            <div className="card p-6 lg:col-span-2">
              <h2 className="font-display text-base font-semibold text-ink-800">Follow-Up Analytics</h2>
              <p className="text-xs text-ink-400">Follow-ups due over the next 7 days</p>
              <div className="mt-4">
                {followupsLoading ? <div className="skeleton h-72 w-full" /> : <FollowupAnalyticsChart followups={followups ?? []} />}
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}

// ---------------------------------------------------------------------------
// Inline icons
// ---------------------------------------------------------------------------
function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...props} aria-hidden="true">
      <circle cx="9" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 20a6.5 6.5 0 0113 0M16 8.5a3 3 0 110-6M15 14a5.5 5.5 0 016.5 5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...props} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AlertIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...props} aria-hidden="true">
      <path d="M12 9v4m0 4h.01M10.3 3.9L2.1 18a1.5 1.5 0 001.3 2.5h17a1.5 1.5 0 001.3-2.5L13.7 3.9a1.5 1.5 0 00-2.4 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PulseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...props} aria-hidden="true">
      <path d="M2 12h4l2-6 4 12 2-8 2 4h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...props} aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v3M16 3v3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...props} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
