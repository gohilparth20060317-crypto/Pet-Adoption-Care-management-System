import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center animate-fade-in">
      <span className="stamp text-brick-500">404</span>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-ink/60">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-stamp bg-forest-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-600">
        Back home
      </Link>
    </div>
  );
}
