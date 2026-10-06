export default function Logo({ className = "", size = "md" }) {
  const isLarge = size === "lg";
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 text-white shadow-card transition-transform group-hover:scale-105 ${
          isLarge ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        <svg
          width={isLarge ? "26" : "22"}
          height={isLarge ? "26" : "22"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Paw toe pads */}
          <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
          <circle cx="6.5" cy="7" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="7" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="3.8" cy="11.5" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="20.2" cy="11.5" r="1.4" fill="currentColor" stroke="none" />
          {/* Main paw heart pad */}
          <path
            d="M12 21.2s-6.2-3.8-8-7.5c-1.3-2.8 0-6 3.2-6 2.2 0 3.5 1.3 4.8 2.8 1.3-1.5 2.6-2.8 4.8-2.8 3.2 0 4.5 3.2 3.2 6-1.8 3.7-8 7.5-8 7.5z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>
      </div>
      <span className={`font-display font-semibold tracking-tight text-forest-700 ${isLarge ? "text-2xl" : "text-xl"}`}>
        PetHaven
      </span>
    </div>
  );
}
