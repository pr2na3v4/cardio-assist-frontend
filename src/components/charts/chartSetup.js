/**
 * components/charts/chartSetup.js
 * ==================================
 * Registers the Chart.js elements/plugins used across the dashboard charts.
 * Imported once by each chart component (Chart.js dedupes registration).
 */

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Legend, Tooltip);

export const CHART_FONT = {
  family: "Inter, ui-sans-serif, system-ui, sans-serif",
  size: 12,
};

export default ChartJS;
