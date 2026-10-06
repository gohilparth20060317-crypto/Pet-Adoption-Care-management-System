import { useEffect, useState } from "react";
import * as petApi from "../../api/petApi";
import PetCard from "../../components/common/PetCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

export default function PetListing() {
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    petApi
      .searchPets({ keyword, page, size: 8, sortBy, sortDir })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, sortBy, sortDir]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    load();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Pets available for adoption</h1>
        <p className="mt-1 text-sm text-ink/60">Search by name or breed, then sort to find your match.</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name or breed…"
          className="min-w-[220px] flex-1 rounded-stamp border border-forest-100 px-3 py-2 text-sm focus-ring focus:border-forest-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-stamp border border-forest-100 px-3 py-2 text-sm focus-ring"
        >
          <option value="id">Newest</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="age">Age</option>
        </select>
        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value)}
          className="rounded-stamp border border-forest-100 px-3 py-2 text-sm focus-ring"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button
          type="submit"
          className="rounded-stamp bg-forest-500 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-600 focus-ring"
        >
          Search
        </button>
      </form>

      {loading && <Loader fullscreen label="Fetching pets…" />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          {data.content.length === 0 ? (
            <EmptyState title="No pets found" message="Try a different search term." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.content.map((pet) => (
                <PetCard key={pet.petId} pet={pet} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={data.totalPages || 0} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
