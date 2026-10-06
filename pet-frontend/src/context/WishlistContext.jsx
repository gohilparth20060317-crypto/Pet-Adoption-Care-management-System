import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

const storageKeyFor = (userId) => `pms_wishlist_${userId || "guest"}`;

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [petIds, setPetIds] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKeyFor(user?.id));
    setPetIds(raw ? JSON.parse(raw) : []);
  }, [user?.id]);

  const persist = useCallback(
    (next) => {
      setPetIds(next);
      localStorage.setItem(storageKeyFor(user?.id), JSON.stringify(next));
    },
    [user?.id]
  );

  const toggle = useCallback(
    (petId) => {
      persist(petIds.includes(petId) ? petIds.filter((id) => id !== petId) : [...petIds, petId]);
    },
    [petIds, persist]
  );

  const isWishlisted = useCallback((petId) => petIds.includes(petId), [petIds]);

  return (
    <WishlistContext.Provider value={{ petIds, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
