import { Link } from "react-router-dom";
import { resolveImageUrl, getSpeciesImage } from "../../utils/imageUrl";
import { useWishlist } from "../../context/WishlistContext";
import VaccinationBadge from "./VaccinationBadge";

export default function PetCard({ pet }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(pet.petId);

  // Check if pet is vaccinated (from entity property or default assumption for demo)
  const isVaccinated = pet.isVaccinated ?? pet.vaccinated ?? true;
  const vaccinationStatus = pet.vaccinationStatus || (isVaccinated ? "Fully Vaccinated" : "Not Vaccinated");

  return (
    <div className="group overflow-hidden rounded-stamp border border-forest-100 bg-surface shadow-card transition hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-forest-50">
        <img
          src={resolveImageUrl(pet.imageUrl, pet.species, pet.name || pet.petId)}
          alt={pet.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = getSpeciesImage(pet.species, pet.name || pet.petId);
          }}
        />
        <div className="absolute left-2 top-2">
          <VaccinationBadge status={vaccinationStatus} isVaccinated={isVaccinated} />
        </div>
        <button
          type="button"
          onClick={() => toggle(pet.petId)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow focus-ring ${
            wishlisted ? "text-brick-500" : "text-ink/40"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7.5-4.6-10-9.1C.5 8 2.5 4 6.5 4c2 0 3.5 1.1 4.5 2.6C12 5.1 13.5 4 15.5 4 19.5 4 21.5 8 20 11.9 19.5 12.7 12 21 12 21z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-ink">{pet.name}</h3>
          <span className="whitespace-nowrap font-mono text-sm font-semibold text-forest-600">
            Rs {Number(pet.price || 0).toFixed(0)}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink/60">
          {pet.species} · {pet.age} {pet.age === 1 ? "yr" : "yrs"} old
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {pet.category?.name && <span className="stamp inline-block text-forest-500">{pet.category.name}</span>}
        </div>
        <Link
          to={`/pets/${pet.petId}`}
          className="mt-4 block rounded-stamp border border-forest-500 px-3 py-1.5 text-center text-sm font-medium text-forest-600 hover:bg-forest-50 focus-ring"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
