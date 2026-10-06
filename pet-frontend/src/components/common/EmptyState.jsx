export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-stamp border border-dashed border-forest-100 bg-surface px-6 py-14 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink/60">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
