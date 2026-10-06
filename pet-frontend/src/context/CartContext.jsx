import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as cartApi from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const storageKeyFor = (userId) => `pms_cart_${userId || "guest"}`;

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKeyFor(user?.id));
    setItems(raw ? JSON.parse(raw) : []);
  }, [user?.id]);

  const persist = useCallback(
    (next) => {
      setItems(next);
      localStorage.setItem(storageKeyFor(user?.id), JSON.stringify(next));
    },
    [user?.id]
  );

  // Adds to the local mirror immediately (optimistic) and syncs to the
  // server cart, which is the source of truth used at checkout time.
  const addItem = useCallback(
    async (pet, quantity = 1) => {
      const next = [...items];
      const existingIndex = next.findIndex((i) => i.pet.petId === pet.petId);
      if (existingIndex >= 0) {
        next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + quantity };
      } else {
        next.push({ pet, quantity });
      }
      persist(next);
      await cartApi.addToCart(pet.petId, quantity);
      return next;
    },
    [items, persist]
  );

  const updateQuantity = useCallback(
    (petId, quantity) => {
      if (quantity <= 0) {
        persist(items.filter((i) => i.pet.petId !== petId));
        cartApi.removeFromCart(petId);
        return;
      }
      persist(items.map((i) => (i.pet.petId === petId ? { ...i, quantity } : i)));
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (petId) => {
      persist(items.filter((i) => i.pet.petId !== petId));
      cartApi.removeFromCart(petId);
    },
    [items, persist]
  );

  const clearCart = useCallback(() => {
    persist([]);
    cartApi.clearServerCart(user?.id);
  }, [persist, user?.id]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * (i.pet.price || 0), 0);

  const value = { items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
