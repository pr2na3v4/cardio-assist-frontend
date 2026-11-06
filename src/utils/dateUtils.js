/**
 * utils/dateUtils.js
 * ===================
 * Small, dependency-free date helpers used across follow-up and history
 * views: formatting, "time from now," and overdue/countdown detection.
 */

export function formatDate(dateInput, options = {}) {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatDateTime(dateInput) {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Human countdown like "In 3 days", "In 4 hours", or "Overdue by 2 days". */
export function followupCountdown(dateInput) {
  if (!dateInput) return { label: "—", overdue: false };
  const target = new Date(dateInput).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const overdue = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const minutes = Math.floor(absMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let label;
  if (days >= 1) label = `${days} day${days === 1 ? "" : "s"}`;
  else if (hours >= 1) label = `${hours} hour${hours === 1 ? "" : "s"}`;
  else label = `${Math.max(minutes, 1)} min${minutes === 1 ? "" : "s"}`;

  return {
    label: overdue ? `Overdue by ${label}` : `In ${label}`,
    overdue,
  };
}

export function isToday(dateInput) {
  if (!dateInput) return false;
  const date = new Date(dateInput);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
