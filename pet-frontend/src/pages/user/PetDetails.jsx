import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as adoptionApi from "../../api/adoptionApi";
import * as petApi from "../../api/petApi"; 
import * as vaccinationApi from "../../api/vaccinationApi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import VaccinationBadge from "../../components/common/VaccinationBadge";
import { resolveImageUrl, getSpeciesImage } from "../../utils/imageUrl";

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const [pet, setPet] = useState(null);
  const [vaccineRecords, setVaccineRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      petApi.getPetById(id),
      vaccinationApi.getVaccinationsByPetId(id),
    ])
      .then(([petData, vacs]) => {
        setPet(petData);
        setVaccineRecords(vacs);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setBusy(true);
    setActionError(null);
    setActionMessage(null);
    try {
      await addItem(pet, quantity);
      setActionMessage("Added to your cart.");
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleAdopt = async () => {
    try {
      const response = await adoptionApi.submitAdoptionRequest(pet.petId, user?.id);
      console.log("Success:", response);
      alert("Adoption request submitted!");
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      alert("Failed to submit adoption request.");
    }
  };

  if (loading) return <Loader fullscreen label="Loading pet…" />;
  if (error) return <ErrorMessage message={error} />;
  if (!pet) return null;

  const wishlisted = isWishlisted(pet.petId);
  const isVaccinated = pet.isVaccinated ?? pet.vaccinated ?? (vaccineRecords.length > 0);
  const vaccinationStatus = pet.vaccinationStatus || (isVaccinated ? "Fully Vaccinated" : "Not Vaccinated");

  return (
    <div className="animate-fade-in space-y-8">
      <Link to="/pets" className="text-sm font-medium text-forest-600 hover:underline">
        &larr; Back to listing
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-stamp border border-forest-100 bg-forest-50 relative">
          <img
            src={resolveImageUrl(pet.imageUrl, pet.species, pet.name || pet.petId)}
            alt={pet.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = getSpeciesImage(pet.species, pet.name || pet.petId);
            }}
          />
          <div className="absolute top-3 left-3">
            <VaccinationBadge status={vaccinationStatus} isVaccinated={isVaccinated} />
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink">{pet.name}</h1>
              <div className="mt-1 flex items-center gap-2">
                <VaccinationBadge status={vaccinationStatus} isVaccinated={isVaccinated} />
                {pet.category?.name && <span className="stamp inline-block text-forest-500">{pet.category.name}</span>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle(pet.petId)}
              className={`rounded-stamp border px-3 py-1.5 text-sm font-medium focus-ring ${wishlisted
                ? "border-brick-500 text-brick-500"
                : "border-forest-100 text-ink/60 hover:bg-forest-50"
                }`}
            >
              {wishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
            </button>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm border-t border-forest-100 pt-4">
            <div>
              <dt className="text-ink/50">Species</dt>
              <dd className="font-medium text-ink">{pet.species}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Age</dt>
              <dd className="font-medium text-ink">{pet.age} years</dd>
            </div>
            <div>
              <dt className="text-ink/50">Health Record</dt>
              <dd className="font-medium text-emerald-700 font-semibold">{vaccinationStatus}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Adoption fee</dt>
              <dd className="font-mono font-semibold text-forest-600">Rs {Number(pet.price || 0).toFixed(0)}</dd>
            </div>
          </dl>

          {actionMessage && (
            <p className="mt-4 rounded-stamp border border-forest-100 bg-forest-50 px-4 py-2 text-sm text-forest-700">
              {actionMessage}
            </p>
          )}
          {actionError && <ErrorMessage className="mt-4" message={actionError} />}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink/70">
              Qty
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-16 rounded-stamp border border-forest-100 px-2 py-1.5 text-sm focus-ring"
              />
            </label>
            <button
              onClick={handleAddToCart}
              disabled={busy}
              className="rounded-stamp bg-forest-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
            >
              {busy ? "Please wait…" : "Add to cart"}
            </button>
            <button
              onClick={handleAdopt}
              disabled={busy}
              className="rounded-stamp border border-marigold-500 px-5 py-2.5 text-sm font-semibold text-marigold-600 hover:bg-marigold-100 disabled:opacity-60 focus-ring"
            >
              Request adoption
            </button>
            <button
              onClick={() => navigate("/vaccinations", { state: { selectedPetId: pet.petId, openModal: true } })}
              className="rounded-stamp border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus-ring"
            >
              💉 Book Vaccination
            </button>
          </div>
        </div>
      </div>

      {/* Vaccination & Health Passport Section */}
      <div className="rounded-stamp border border-forest-100 bg-surface p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest-100 pb-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink flex items-center gap-2">
              <span>💉</span> Vaccination & Health Passport
            </h2>
            <p className="text-xs text-ink/60 mt-0.5">Official medical & immunization details for {pet.name}</p>
          </div>
          <button
            onClick={() => navigate("/vaccinations", { state: { selectedPetId: pet.petId, openModal: true } })}
            className="rounded-stamp bg-forest-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-forest-600 focus-ring"
          >
            + Schedule Vaccine Booster
          </button>
        </div>

        {vaccineRecords.length === 0 ? (
          <div className="rounded-stamp border border-dashed border-forest-200 p-6 text-center text-ink/60 text-sm">
            No detailed vaccine logs listed yet. Pet health status: <span className="font-semibold text-ink">{vaccinationStatus}</span>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-forest-100 text-xs font-semibold uppercase text-ink/50">
                <tr>
                  <th className="py-2.5 px-3">Vaccine Name</th>
                  <th className="py-2.5 px-3">Date Administered</th>
                  <th className="py-2.5 px-3">Next Booster Due</th>
                  <th className="py-2.5 px-3">Veterinarian</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {vaccineRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-forest-50/50">
                    <td className="py-3 px-3 font-medium text-ink">{rec.vaccineName}</td>
                    <td className="py-3 px-3 text-ink/70 font-mono text-xs">{rec.dateAdministered || "N/A"}</td>
                    <td className="py-3 px-3 text-ink/70 font-mono text-xs">{rec.nextDueDate || "N/A"}</td>
                    <td className="py-3 px-3 text-ink/70">{rec.veterinarian || "Staff Vet"}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        {rec.status || "Up to date"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
