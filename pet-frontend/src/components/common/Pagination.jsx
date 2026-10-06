export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  const windowStart = Math.max(0, Math.min(page - 2, totalPages - 5));
  const visible = pages.slice(Math.max(windowStart, 0), windowStart + 5);

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="rounded-stamp border border-forest-100 px-3 py-1.5 text-sm text-forest-600 disabled:opacity-30 hover:bg-forest-50 focus-ring"
      >
        Prev
      </button>
      {visible.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-9 w-9 rounded-stamp text-sm font-medium focus-ring ${
            p === page ? "bg-forest-500 text-white" : "text-forest-600 hover:bg-forest-50"
          }`}
        >
          {p + 1}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        className="rounded-stamp border border-forest-100 px-3 py-1.5 text-sm text-forest-600 disabled:opacity-30 hover:bg-forest-50 focus-ring"
      >
        Next
      </button>
    </nav>
  );
}
