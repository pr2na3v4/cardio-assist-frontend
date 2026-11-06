/**
 * components/charts/RiskDistributionChart.jsx
 * ===============================================
 * Donut chart showing patient count by risk level (Healthy / Moderate /
 * High / Critical), color-coded to match the app's risk color system.
 */

import { Doughnut } from "react-chartjs-2";
import "./chartSetup";
import { CHART_FONT } from "./chartSetup";

export default function RiskDistributionChart({ healthy = 0, moderate = 0, high = 0, critical = 0 }) {
  const total = healthy + moderate + high + critical;

  const data = {
    labels: ["Healthy", "Moderate Risk", "High Risk", "Critical"],
    datasets: [
      {
        data: [healthy, moderate, high, critical],
        backgroundColor: ["#2E9E6B", "#E8A23D", "#E8763D", "#D1425B"],
        borderColor: "#FFFFFF",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: CHART_FONT, color: "#0B3B45", padding: 16, usePointStyle: true, pointStyle: "circle" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const pct = total ? ((ctx.parsed / total) * 100).toFixed(0) : 0;
            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative h-72">
      <Doughnut data={data} options={options} aria-label="Risk distribution chart" role="img" />
      {total === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-ink-300">No prediction data yet</p>
      )}
    </div>
  );
}
