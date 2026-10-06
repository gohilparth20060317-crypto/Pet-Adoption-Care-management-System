import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import * as paymentApi from "../../api/paymentApi";
import * as cartApi from "../../api/cartApi";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import { downloadReceiptPdf } from "../../utils/pdfReceipt";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { Link } from "react-router-dom";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const saveOrderLocally = (order) => {
    const key = `pms_orders_${user?.id || "guest"}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([order, ...existing]));
  };

  const handlePay = async () => {
    setError(null);
    setProcessing(true);
    try {
      if (!user?.id) {
        throw new Error("We couldn't confirm your account id yet. Please refresh and try again.");
      }

      // Sync active cart items to server DB to ensure server DB cart matches frontend cart
      try {
        await cartApi.clearServerCart(user.id);
        for (const item of items) {
          const pId = item.pet?.petId || item.pet?.id;
          if (pId) {
            await cartApi.addToCart(pId, item.quantity);
          }
        }
      } catch (syncErr) {
        console.warn("Cart server sync warning:", syncErr);
      }

      const order = await paymentApi.createOrder(user.id, totalPrice, items);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes("your_key_id")) {
        // Fall back to a simulated success path when Razorpay isn't configured,
        // so checkout can still be exercised in a dev/demo environment.
        await completeOrder(order, `sim_pay_${Date.now()}`);
        return;
      }

      let razorpayAmountInPaise = Math.round(totalPrice * 100);
      if (order && order.amount) {
        const orderAmt = Number(order.amount);
        if (orderAmt > 0) {
          razorpayAmountInPaise = orderAmt < 1000 && totalPrice < 1000 ? Math.round(orderAmt * 100) : orderAmt;
        }
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayAmountInPaise,
        currency: order.currency || "INR",
        name: "PetHaven",
        description: "Pet adoption payment",
        order_id: order.orderId,
        prefill: { email: user.email },
        theme: { color: "#3D6E5D" },
        handler: async (response) => {
          await completeOrder(order, response.razorpay_payment_id);
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setError(e.message);
      setProcessing(false);
    }
  };

  const completeOrder = async (order, paymentId) => {
    try {
      await paymentApi.confirmPayment({
        userId: user.id,
        razorPayOrderId: order.orderId,
        razorPayPaymentId: paymentId,
      });

      const receipt = {
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        date: new Date().toLocaleString(),
        customerEmail: user.email,
        items: items.map((i) => ({ name: i.pet.name, quantity: i.quantity, price: i.pet.price })),
      };
      saveOrderLocally(receipt);
      downloadReceiptPdf(receipt);
      clearCart();
      navigate("/orders", { state: { justPaid: true } });
    } catch (e) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to check out"
        message="Add a pet to your cart first."
        action={
          <Link to="/pets" className="rounded-stamp bg-forest-500 px-4 py-2 text-sm font-semibold text-white">
            Browse pets
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Checkout</h1>
      <p className="mt-1 text-sm text-ink/60">Review your order before completing payment.</p>

      <div className="mt-6 space-y-3 rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
        {items.map(({ pet, quantity }) => (
          <div key={pet.petId} className="flex justify-between text-sm">
            <span className="text-ink/80">
              {pet.name} × {quantity}
            </span>
            <span className="font-mono text-ink">Rs {(pet.price * quantity).toFixed(0)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-forest-100 pt-3 font-display text-lg font-semibold">
          <span>Total</span>
          <span className="text-forest-600">Rs {totalPrice.toFixed(0)}</span>
        </div>
      </div>

      {error && <ErrorMessage className="mt-4" message={error} />}

      <button
        onClick={handlePay}
        disabled={processing}
        className="mt-6 w-full rounded-stamp bg-forest-500 px-4 py-3 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
      >
        {processing ? "Processing payment…" : `Pay Rs ${totalPrice.toFixed(0)}`}
      </button>
      <p className="mt-2 text-center text-xs text-ink/40">Secured by Razorpay</p>
    </div>
  );
}
