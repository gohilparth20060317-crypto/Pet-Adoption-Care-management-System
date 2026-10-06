import { useEffect, useState } from "react";
import { getAllAdoptionRequests } from "../../api/adminAggregateApi";
import * as adoptionApi from "../../api/adoptionApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusStamp from "../../components/common/StatusStamp";
import EmptyState from "../../components/common/EmptyState";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

export default function ManageAdoptions() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getAllAdoptionRequests()
      .then((data) => setRequests(data.sort((a, b) => (b.id || 0) - (a.id || 0))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await adoptionApi.updateAdoptionStatus(id, status);
      setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Manage adoptions</h1>
        <p className="mt-1 text-sm text-ink/60">Review and update the status of adoption requests.</p>
        <p className="mt-1 text-xs text-ink/40">
          Aggregated from each user's adoption history, since the API doesn't yet expose a single
          "list all requests" endpoint.
        </p>
      </div>

      {loading && <Loader fullscreen label="Loading adoption requests…" />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && requests.length === 0 && (
        <EmptyState title="No adoption requests" message="Requests submitted by users will appear here." />
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="overflow-x-auto rounded-stamp border border-forest-100 bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-forest-100 text-ink/50">
              <tr>
                <th className="px-4 py-3 font-medium">Pet</th>
                <th className="px-4 py-3 font-medium">Requested by</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Update</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-forest-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{r.pet?.name || `#${r.pet?.petId ?? "—"}`}</td>
                  <td className="px-4 py-3 text-ink/70">{r.user?.username || r.user?.email || `#${r.user?.id ?? "—"}`}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {r.requestDate ? new Date(r.requestDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusStamp status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      disabled={updatingId === r.id}
                      value={r.status || "PENDING"}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      className="rounded-stamp border border-forest-100 px-2 py-1.5 text-sm focus-ring"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
