const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");

const SPECIES_IMAGES = {
  dog: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
  ],
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=600&q=80",
  ],
  bird: [
    "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&q=80",
  ],
  rabbit: [
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
  ],
  fish: [
    "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80",
  ],
  hamster: [
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80",
  ],
  turtle: [
    "https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=600&q=80",
  ],
};

export const PLACEHOLDER_PET_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23EAF0EC'/><text x='50%' y='50%' font-family='sans-serif' font-size='16' fill='%237FA089' text-anchor='middle' dy='.3em'>No photo yet</text></svg>`
  );

export const getSpeciesImage = (species, seed = "") => {
  if (!species || typeof species !== "string") return PLACEHOLDER_PET_IMAGE;
  const s = species.trim().toLowerCase();

  let key = Object.keys(SPECIES_IMAGES).find((k) => s.includes(k));
  if (!key) {
    // If unknown species, default to dog or cat based on hash
    key = s.charCodeAt(0) % 2 === 0 ? "dog" : "cat";
  }

  const list = SPECIES_IMAGES[key];
  if (!list || list.length === 0) return PLACEHOLDER_PET_IMAGE;

  let hash = 0;
  const str = String(seed || species);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % list.length;
  return list[index];
};

export const resolveImageUrl = (imageUrl, species = null, seed = "") => {
  if (imageUrl && typeof imageUrl === "string" && imageUrl.trim().length > 0) {
    if (imageUrl.startsWith("data:")) return imageUrl;
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    if (/^\/\//.test(imageUrl)) return `${window.location.protocol}${imageUrl}`;
    return `${BASE_URL}/${imageUrl.replace(/^\/+/, "")}`;
  }

  if (species) {
    return getSpeciesImage(species, seed);
  }

  return PLACEHOLDER_PET_IMAGE;
};

