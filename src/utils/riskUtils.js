/**
 * utils/riskUtils.js
 * ===================
 * Single source of truth on the frontend for how risk levels are labeled
 * and colored: Healthy = green, Moderate = yellow, High = orange,
 * Critical = red, per the healthcare-specific color system requirement.
 */

export const RISK_LEVELS = {
  Low: {
    label: "Healthy",
    textClass: "text-risk-healthy",
    bgClass: "bg-risk-healthy-bg",
    dotClass: "bg-risk-healthy",
    chart: "#2E9E6B",
  },
  Moderate: {
    label: "Moderate Risk",
    textClass: "text-risk-moderate",
    bgClass: "bg-risk-moderate-bg",
    dotClass: "bg-risk-moderate",
    chart: "#E8A23D",
  },
  High: {
    label: "High Risk",
    textClass: "text-risk-high",
    bgClass: "bg-risk-high-bg",
    dotClass: "bg-risk-high",
    chart: "#E8763D",
  },
  Critical: {
    label: "Critical",
    textClass: "text-risk-critical",
    bgClass: "bg-risk-critical-bg",
    dotClass: "bg-risk-critical",
    chart: "#D1425B",
  },
};

export function getRiskMeta(riskLevel) {
  return RISK_LEVELS[riskLevel] || RISK_LEVELS.Moderate;
}

export const CLUSTER_LABELS = {
  0: "Critical Cardiac Risk Group",
  1: "High Cholesterol Risk Group",
  2: "Hypertension Risk Group",
  3: "Healthy Cardiac Group",
  4: "Senior Cardiac Monitoring Group",
};
