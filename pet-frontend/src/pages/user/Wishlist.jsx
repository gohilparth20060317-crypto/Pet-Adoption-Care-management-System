import { useEffect, useState } from "react";
import * as petApi from "../../api/petApi";
import { useWishlist } from "../../context/WishlistContext";
import PetCard from "../../components/common/PetCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { petIds } = useWishlist();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (petIds.length === 0) {
      setPets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(petIds.map((id) => petApi.getPetById(id).catch(() => null)))
      .then((results) => setPets(results.filter(Boolean)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [petIds]);

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Your wishlist</h1>
      <p className="mt-1 text-sm text-ink/60">Pets you've saved for later.</p>

      {loading && <Loader fullscreen label="Loading wishlist…" />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && pets.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="Your wishlist is empty"
            message="Tap the heart on any pet to save it here."
            action={
              <Link to="/pets" className="rounded-stamp bg-forest-500 px-4 py-2 text-sm font-semibold text-white">
                Browse pets
              </Link>
            }
          />
        </div>
      )}

      {!loading && !error && pets.length > 0 && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pets.map((pet) => (
            <PetCard key={pet.petId} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
