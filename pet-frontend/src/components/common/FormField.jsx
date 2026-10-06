export default function FormField({ label, error, children, hint, required }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-brick-500"> *</span>}
      </span>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-brick-500">{error}</p>}
    </label>
  );
}

export const inputClass = (hasError) =>
  `w-full rounded-stamp border px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus-ring focus:border-forest-500 ${
    hasError ? "border-brick-500" : "border-forest-100"
  }`;
