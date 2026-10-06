export default function ErrorMessage({ message, onRetry, className = "" }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-stamp border border-brick-500/40 bg-brick-100 px-4 py-3 text-sm text-brick-600 ${className}`}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline focus-ring"
        >
          Retry
        </button>
      )}
    </div>
  );
}
