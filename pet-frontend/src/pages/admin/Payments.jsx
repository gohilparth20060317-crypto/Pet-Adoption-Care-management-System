import { useEffect, useState } from "react";
import * as paymentApi from "../../api/paymentApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusStamp from "../../components/common/StatusStamp";
import EmptyState from "../../components/common/EmptyState";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    paymentApi
      .getAllPayments()
      .then((data) => setPayments(data.sort((a, b) => (b.id || 0) - (a.id || 0))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const totalRevenue = payments
    .filter((p) => (p.status || "").toUpperCase() === "SUCCESS")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Payments</h1>
        <p className="mt-1 text-sm text-ink/60">All adoption fee payments processed through Razorpay.</p>
      </div>

      {loading && <Loader fullscreen label="Loading payments…" />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          <div className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card sm:w-64">
            <p className="font-display text-3xl font-semibold text-forest-600">
              Rs {totalRevenue.toFixed(0)}
            </p>
            <p className="mt-1 text-sm text-ink/60">Total confirmed revenue</p>
          </div>

          {payments.length === 0 ? (
            <EmptyState title="No payments yet" message="Completed checkouts will show up here." />
          ) : (
            <div className="overflow-x-auto rounded-stamp border border-forest-100 bg-surface shadow-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-forest-100 text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Razorpay order</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-forest-100 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-ink/70">{p.razorpayOrderId}</td>
                      <td className="px-4 py-3 text-ink/70">{p.user?.username || p.user?.email || `#${p.user?.id ?? "—"}`}</td>
                      <td className="px-4 py-3 font-mono text-ink">Rs {Number(p.amount || 0).toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <StatusStamp status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-ink/60">
                        {p.paymentdate ? new Date(p.paymentdate).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
