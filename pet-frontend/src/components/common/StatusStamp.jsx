const COLORS = {
  PENDING: "text-marigold-600",
  APPROVED: "text-forest-600",
  SUCCESS: "text-forest-600",
  REJECTED: "text-brick-500",
  FAILED: "text-brick-500",
  ADOPTED: "text-forest-600",
  AVAILABLE: "text-forest-500",
};

export default function StatusStamp({ status }) {
  const key = (status || "").toUpperCase();
  const color = COLORS[key] || "text-ink";
  return <span className={`stamp ${color}`}>{status || "Unknown"}</span>;
}
