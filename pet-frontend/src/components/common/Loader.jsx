export default function Loader({ label = "Loading…", size = "md", fullscreen = false }) {
  const dims = size === "sm" ? "h-4 w-4 border-2" : size === "lg" ? "h-10 w-10 border-4" : "h-6 w-6 border-[3px]";

  const spinner = (
    <div className="flex items-center gap-3 text-forest-600">
      <span
        className={`inline-block ${dims} rounded-full border-forest-200 border-t-forest-600 animate-spin`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">{spinner}</div>
    );
  }
  return spinner;
}
