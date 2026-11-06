/**
 * components/charts/PatientDistributionChart.jsx
 * ==================================================
 * Bar chart showing prediction count by K-Means cluster / risk group
 * (Healthy, High Cholesterol, Hypertension, Senior Monitoring, Critical).
 */

import { Bar } from "react-chartjs-2";
import "./chartSetup";
import { CHART_FONT } from "./chartSetup";

const GROUP_COLORS = {
  "Healthy Cardiac Group": "#2E9E6B",
  "High Cholesterol Risk Group": "#E8A23D",
  "Hypertension Risk Group": "#E8A23D",
  "Senior Cardiac Monitoring Group": "#E8763D",
  "Critical Cardiac Risk Group": "#D1425B",
};

export default function PatientDistributionChart({ predictionsByCluster = {} }) {
  const labels = Object.keys(predictionsByCluster);
  const values = Object.values(predictionsByCluster);
  const hasData = labels.length > 0 && values.some((v) => v > 0);

  const data = {
    labels: labels.map((l) => l.replace(" Group", "").replace(" Risk", "")),
    datasets: [
      {
        label: "Patients",
        data: values,
        backgroundColor: labels.map((l) => GROUP_COLORS[l] || "#3F7E86"),
        borderRadius: 8,
        maxBarThickness: 42,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} patients` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: CHART_FONT, color: "#3F7E86" } },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, font: CHART_FONT, color: "#3F7E86" },
        grid: { color: "#E3EBEC" },
      },
    },
  };

  return (
    <div className="relative h-72">
      <Bar data={data} options={options} aria-label="Patient distribution by risk group" role="img" />
      {!hasData && <p className="absolute inset-0 flex items-center justify-center text-sm text-ink-300">No prediction data yet</p>}
    </div>
  );
}
