import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../../components/common/EmptyState";
import { downloadReceiptPdf } from "../../utils/pdfReceipt";

export default function Orders() {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const key = `pms_orders_${user?.id || "guest"}`;
    setOrders(JSON.parse(localStorage.getItem(key) || "[]"));
  }, [user?.id]);

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Your orders</h1>
      <p className="mt-1 text-sm text-ink/60">
        Completed adoption payments and their receipts.
      </p>
      {location.state?.justPaid && (
        <p className="mt-4 rounded-stamp border border-forest-100 bg-forest-50 px-4 py-2 text-sm text-forest-700">
          Payment complete — your receipt downloaded automatically.
        </p>
      )}

      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No orders yet" message="Completed checkouts will show up here." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="flex flex-col gap-3 rounded-stamp border border-forest-100 bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono text-xs text-ink/50">{order.orderId}</p>
                <p className="mt-1 text-sm text-ink/70">
                  {order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                </p>
                <p className="mt-1 text-xs text-ink/40">{order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-semibold text-forest-600">
                  Rs {Number(order.amount).toFixed(0)}
                </span>
                <button
                  onClick={() => downloadReceiptPdf(order)}
                  className="rounded-stamp border border-forest-500 px-3 py-1.5 text-sm font-medium text-forest-600 hover:bg-forest-50 focus-ring"
                >
                  Download receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
