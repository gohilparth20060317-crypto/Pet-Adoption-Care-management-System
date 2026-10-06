import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import EmptyState from "../../components/common/EmptyState";
import { resolveImageUrl, getSpeciesImage } from "../../utils/imageUrl";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse available pets and add one to get started."
        action={
          <Link
            to="/pets"
            className="rounded-stamp bg-forest-500 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-600 focus-ring"
          >
            Browse pets
          </Link>
        }
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Your cart</h1>
      <p className="mt-1 text-sm text-ink/60">{totalItems} item(s) ready for checkout.</p>

      <div className="mt-6 space-y-4">
        {items.map(({ pet, quantity }) => (
          <div
            key={pet.petId}
            className="flex flex-col gap-4 rounded-stamp border border-forest-100 bg-surface p-4 shadow-card sm:flex-row sm:items-center"
          >
            <img
              src={resolveImageUrl(pet.imageUrl, pet.species, pet.name || pet.petId)}
              alt={pet.name}
              className="h-20 w-20 rounded-stamp object-cover"
              onError={(e) => {
                e.currentTarget.src = getSpeciesImage(pet.species, pet.name || pet.petId);
              }}
            />
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-ink">{pet.name}</h3>
              <p className="text-sm text-ink/60">Rs {Number(pet.price || 0).toFixed(0)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink/50">Qty</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => updateQuantity(pet.petId, Math.max(1, Number(e.target.value)))}
                className="w-16 rounded-stamp border border-forest-100 px-2 py-1.5 text-sm focus-ring"
              />
            </div>
            <p className="w-24 text-right font-mono text-sm font-semibold text-forest-600">
              Rs {(pet.price * quantity).toFixed(0)}
            </p>
            <button
              onClick={() => removeItem(pet.petId)}
              className="text-sm font-medium text-brick-500 hover:underline focus-ring"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-3 border-t border-forest-100 pt-6">
        <p className="font-display text-xl font-semibold text-ink">
          Total: <span className="text-forest-600">Rs {totalPrice.toFixed(0)}</span>
        </p>
       <button onClick={() => navigate("/delivery-location")}
        className="rounded-stamp bg-forest-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 focus-ring"
        >Proceed to checkout</button>
      </div>
    </div>
  );
}
