import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import * as adoptionApi from "../../api/adoptionApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusStamp from "../../components/common/StatusStamp";
import EmptyState from "../../components/common/EmptyState";

export default function Dashboard() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { petIds } = useWishlist();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    adoptionApi
      .getAdoptionHistory(user.id)
      .then(setHistory)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const stats = [
    { label: "Adoption requests", value: history.length },
    { label: "Items in cart", value: totalItems },
    { label: "Wishlisted pets", value: petIds.length },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Welcome back{user?.username ? `, ${user.username}` : ""}
        </h1>
        <p className="mt-1 text-sm text-ink/60">Here's where things stand with your adoptions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
            <p className="font-display text-3xl font-semibold text-forest-600">{s.value}</p>
            <p className="mt-1 text-sm text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/pets" className="rounded-stamp bg-forest-500 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-600 focus-ring">
          Browse pets
        </Link>
        <Link to="/wishlist" className="rounded-stamp border border-forest-500 px-4 py-2 text-sm font-medium text-forest-600 hover:bg-forest-50 focus-ring">
          View wishlist
        </Link>
        <Link to="/cart" className="rounded-stamp border border-forest-500 px-4 py-2 text-sm font-medium text-forest-600 hover:bg-forest-50 focus-ring">
          Go to cart
        </Link>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-ink">Your adoption requests</h2>
        <div className="mt-4">
          {loading && <Loader label="Loading history…" />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && history.length === 0 && (
            <EmptyState title="No requests yet" message="Submit an adoption request from a pet's details page." />
          )}
          {!loading && !error && history.length > 0 && (
            <div className="overflow-x-auto rounded-stamp border border-forest-100 bg-surface shadow-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-forest-100 text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Pet</th>
                    <th className="px-4 py-3 font-medium">Requested</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((req) => (
                    <tr key={req.id} className="border-b border-forest-100 last:border-0">
                      <td className="px-4 py-3 text-ink">{req.pet?.name || `Pet #${req.pet?.petId ?? "—"}`}</td>
                      <td className="px-4 py-3 text-ink/60">
                        {req.requestDate ? new Date(req.requestDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusStamp status={req.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
