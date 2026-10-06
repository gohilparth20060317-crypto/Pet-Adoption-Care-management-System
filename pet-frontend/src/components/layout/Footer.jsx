import Logo from "../common/Logo";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-forest-100 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="leash-divider mb-6" />
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-ink/60 sm:flex-row">
          <Logo />
          <span>&copy; {new Date().getFullYear()} PetHaven Pet Management. Every pet deserves a home.</span>
        </div>
      </div>
    </footer>
  );
}
