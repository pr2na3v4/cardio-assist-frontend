/**
 * components/Pagination.jsx
 * ============================
 * Shared pagination footer used by all data tables.
 */

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-surface-border px-4 py-3.5">
      <p className="text-xs text-ink-400">
        Page <span className="font-semibold text-ink-700">{page}</span> of {totalPages}
      </p>
      <div className="flex gap-2">
        <button onClick={onPrev} disabled={page === 1} className="btn-ghost btn-sm disabled:opacity-40" aria-label="Previous page">
          Previous
        </button>
        <button onClick={onNext} disabled={page === totalPages} className="btn-ghost btn-sm disabled:opacity-40" aria-label="Next page">
          Next
        </button>
      </div>
    </div>
  );
}
