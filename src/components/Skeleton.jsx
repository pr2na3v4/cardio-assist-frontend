/**
 * components/Skeleton.jsx
 * =========================
 * Reusable skeleton-loading placeholders for text, table rows, and cards.
 */

export function SkeletonText({ width = "w-full", className = "" }) {
  return <div className={`skeleton h-4 ${width} ${className}`} />;
}

export function SkeletonTableRows({ rows = 5, cols = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-surface-border">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-4">
              <div className="skeleton h-4 w-full max-w-[140px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="skeleton mb-3 h-4 w-24" />
      <div className="skeleton h-8 w-16" />
    </div>
  );
}
