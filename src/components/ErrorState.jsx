/**
 * components/ErrorState.jsx
 * ============================
 * Shown when an API call fails. Explains what went wrong and offers retry.
 */

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-risk-critical-bg text-risk-critical">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 003.5 20.5h17a1.5 1.5 0 001.39-2.46L13.71 3.86a1.5 1.5 0 00-2.42 0z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-800">Couldn't load this</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-400">{message || "Something went wrong while fetching data."}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost btn-sm mt-5">
          Try again
        </button>
      )}
    </div>
  );
}
