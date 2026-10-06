import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as categoryApi from "../../api/categoryApi";
import * as petApi from "../../api/petApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import PetCard from "../../components/common/PetCard";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      categoryApi.getCategories().catch(() => []),
      petApi.getPets(0, 50).catch(() => ({ content: [] })),
    ])
      .then(([cats, petsData]) => {
        setCategories(cats || []);
        const petList = petsData?.content || (Array.isArray(petsData) ? petsData : []);
        setPets(petList);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const browseLink = isAuthenticated ? (isAdmin ? "/admin/pets" : "/pets") : "/login";

  // Calculate pet availability metrics
  const totalAvailablePets = pets.length;
  const speciesCounts = pets.reduce((acc, pet) => {
    const s = pet.species ? pet.species.trim().charAt(0).toUpperCase() + pet.species.trim().slice(1).toLowerCase() : "Other";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const dogCount = speciesCounts["Dog"] || 0;
  const catCount = speciesCounts["Cat"] || 0;
  const birdCount = speciesCounts["Bird"] || 0;
  const otherCount = totalAvailablePets - (dogCount + catCount + birdCount);

  return (
    <div className="animate-fade-in space-y-16">
      {/* Hero Section */}
      <section className="grid items-center gap-10 py-6 md:grid-cols-2 md:py-12">
        <div>
          <span className="stamp text-marigold-600">New arrivals weekly</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Find a companion, not just a pet.
          </h1>
          <p className="mt-4 max-w-md text-ink/70">
            PetHaven connects loving homes with pets who need one — browse profiles, request an
            adoption, and bring them home with a clear paper trail every step of the way.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-3.5 py-1.5 text-xs font-semibold text-forest-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {totalAvailablePets} Pets Currently Available for Adoption
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={browseLink}
              className="rounded-stamp bg-forest-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 focus-ring"
            >
              Browse pets ({totalAvailablePets})
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="rounded-stamp border border-forest-500 px-5 py-2.5 text-sm font-semibold text-forest-600 hover:bg-forest-50 focus-ring"
              >
                Create an account
              </Link>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square w-full rounded-stamp bg-forest-100/60 p-8 shadow-card">
            <div className="flex h-full flex-col justify-between rounded-stamp border-2 border-dashed border-forest-300 p-6 bg-surface/50">
              <div>
                <span className="font-display text-2xl text-forest-600">Live Pet Availability</span>
                <p className="mt-1 text-xs text-ink/60">Updated in real-time</p>
              </div>

              <div className="space-y-3 text-sm text-forest-800">
                <div className="flex justify-between border-b border-forest-100 pb-1.5">
                  <span>Total Available Pets</span>
                  <span className="font-mono font-bold text-forest-600">{totalAvailablePets}</span>
                </div>
                <div className="flex justify-between border-b border-forest-100 pb-1.5">
                  <span>🐶 Dogs</span>
                  <span className="font-mono font-semibold">{dogCount}</span>
                </div>
                <div className="flex justify-between border-b border-forest-100 pb-1.5">
                  <span>🐱 Cats</span>
                  <span className="font-mono font-semibold">{catCount}</span>
                </div>
                <div className="flex justify-between border-b border-forest-100 pb-1.5">
                  <span>🦜 Birds</span>
                  <span className="font-mono font-semibold">{birdCount}</span>
                </div>
                {otherCount > 0 && (
                  <div className="flex justify-between border-b border-forest-100 pb-1.5">
                    <span>🐾 Other Species</span>
                    <span className="font-mono font-semibold">{otherCount}</span>
                  </div>
                )}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-ink/60">Adoption Status:</span>
                  <span className="stamp text-forest-600">Ready to Adopt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Availability Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
          <p className="font-mono text-3xl font-bold text-forest-600">{totalAvailablePets}</p>
          <p className="mt-1 text-sm font-medium text-ink">Total Available Pets</p>
          <p className="text-xs text-ink/50">Ready for instant adoption</p>
        </div>
        <div className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
          <p className="font-mono text-3xl font-bold text-forest-600">{dogCount}</p>
          <p className="mt-1 text-sm font-medium text-ink">Dogs Available</p>
          <p className="text-xs text-ink/50">Friendly & active dogs</p>
        </div>
        <div className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
          <p className="font-mono text-3xl font-bold text-forest-600">{catCount}</p>
          <p className="mt-1 text-sm font-medium text-ink">Cats Available</p>
          <p className="text-xs text-ink/50">Loving & playful cats</p>
        </div>
        <div className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
          <p className="font-mono text-3xl font-bold text-forest-600">{birdCount + otherCount}</p>
          <p className="mt-1 text-sm font-medium text-ink">Birds & Other Pets</p>
          <p className="text-xs text-ink/50">Birds, rabbits & more</p>
        </div>
      </section>

      {/* Featured Pets Available */}
      {pets.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Pets Available for Adoption</h2>
              <p className="mt-0.5 text-sm text-ink/60">Showing {Math.min(4, pets.length)} of {totalAvailablePets} pets currently available</p>
            </div>
            <Link to={browseLink} className="text-sm font-medium text-forest-600 hover:underline">
              View all ({totalAvailablePets}) &rarr;
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pets.slice(0, 4).map((pet) => (
              <PetCard key={pet.petId || pet.id} pet={pet} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Browse by category</h2>
        </div>
        {loading && <Loader label="Loading categories…" />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.length === 0 && (
              <p className="col-span-full text-sm text-ink/60">No categories have been added yet.</p>
            )}
            {categories.map((c) => (
              <div key={c.id} className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
                <h3 className="font-display text-lg font-semibold text-forest-600">{c.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{c.description || "No description yet."}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Process Workflow */}
      <section className="grid gap-6 rounded-stamp bg-forest-600 px-8 py-10 text-forest-50 sm:grid-cols-3">
        {[
          ["01", "Browse & apply", "Explore available pets and submit an adoption request in a few clicks."],
          ["02", "Get approved", "Our team reviews your request and updates its status transparently."],
          ["03", "Bring them home", "Complete payment for adoption fees and download your receipt."],
        ].map(([num, title, body]) => (
          <div key={num}>
            <span className="font-mono text-sm text-marigold-300">{num}</span>
            <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-forest-100/80">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

