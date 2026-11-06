/**
 * components/charts/FollowupAnalyticsChart.jsx
 * ================================================
 * Line chart showing how many follow-ups are due each day over the next
 * 7 days, computed client-side from the /followups list (the backend
 * doesn't expose a time-series endpoint, so we bucket by date here).
 */

import { Line } from "react-chartjs-2";
import "./chartSetup";
import { CHART_FONT } from "./chartSetup";

function bucketByDay(followups) {
  const days = [];
  const counts = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() + i);
    days.push(day);
    counts.push(0);
  }

  followups.forEach((f) => {
    const date = new Date(f.next_followup_date);
    date.setHours(0, 0, 0, 0);
    const idx = days.findIndex((d) => d.getTime() === date.getTime());
    if (idx >= 0) counts[idx] += 1;
  });

  const labels = days.map((d, i) =>
    i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
  );

  return { labels, counts };
}

export default function FollowupAnalyticsChart({ followups = [] }) {
  const { labels, counts } = bucketByDay(followups);
  const hasData = counts.some((c) => c > 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Follow-ups due",
        data: counts,
        borderColor: "#E33F5C",
        backgroundColor: "rgba(227, 63, 92, 0.1)",
        pointBackgroundColor: "#E33F5C",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} follow-up${ctx.parsed.y === 1 ? "" : "s"}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: CHART_FONT, color: "#3F7E86" } },
      y: { beginAtZero: true, ticks: { precision: 0, font: CHART_FONT, color: "#3F7E86" }, grid: { color: "#E3EBEC" } },
    },
  };

  return (
    <div className="relative h-72">
      <Line data={data} options={options} aria-label="Follow-up analytics over the next 7 days" role="img" />
      {!hasData && <p className="absolute inset-0 flex items-center justify-center text-sm text-ink-300">No upcoming follow-ups</p>}
    </div>
  );
}
