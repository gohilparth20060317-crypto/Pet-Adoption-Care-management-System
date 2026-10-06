import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Logo from "../common/Logo";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-forest-600 ${
    isActive ? "text-forest-600" : "text-ink/70"
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const userLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/pets", label: "Pets" },
    { to: "/vaccinations", label: "Vaccinations" },
    { to: "/cart", label: `Cart${totalItems ? ` (${totalItems})` : ""}` },
    { to: "/orders", label: "Orders" },
  ];

  const adminLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/pets", label: "Pets" },
    { to: "/admin/vaccinations", label: "Vaccinations" },
    { to: "/admin/categories", label: "Categories" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/adoptions", label: "Adoptions" },
    { to: "/admin/payments", label: "Payments" },
  ];

  const links = isAdmin ? adminLinks : isAuthenticated ? userLinks : publicLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/"} className="group flex items-center gap-2">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/" || l.to === "/admin"} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <NavLink to="/profile" className={linkClass}>
                  {user?.username || user?.email}
                </NavLink>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-stamp border border-forest-500 px-3 py-1.5 text-sm font-medium text-forest-600 hover:bg-forest-50 focus-ring"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-stamp bg-forest-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-forest-600 focus-ring"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>

        <button
          className="rounded-stamp p-2 text-ink md:hidden focus-ring"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-forest-100 bg-surface px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <NavLink to="/profile" onClick={() => setOpen(false)} className={linkClass}>
                    Profile
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate("/");
                  }}
                  className="text-left text-sm font-medium text-brick-500"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className={linkClass}>
                  Log in
                </NavLink>
                <NavLink to="/register" onClick={() => setOpen(false)} className={linkClass}>
                  Sign up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
