import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Scissors, Menu, X, Calendar, LogOut, User } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useAuth } from "../../hooks/useAuth";
import { NavSectionButton } from "../../../features/landing/components/NavSectionButton";

// ── Extracted outside the parent component ────────────────────────────────
// Declaring NavSectionButton inside PublicNavbar would recreate it as a new
// component type on every render, causing React to unmount/remount it and
// losing any internal state. Always declare helper components at module scope.

// ─────────────────────────────────────────────────────────────────────────

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, profile } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBooking = () => {
    navigate(session ? "/booking" : "/login");
    setIsMenuOpen(false);
  };

  /**
   * Scrolls to a section by id.
   * - If already on "/", scrolls directly.
   * - If on another route, navigates to "/" with the hash so that
   *   LandingPage's useEffect handles the scroll after mount.
   */
  const handleSectionClick = (sectionId: string) => {
    setIsMenuOpen(false);

    if (location.pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const desktopNavClass =
    "text-sm text-zinc-400 hover:text-zinc-100 transition-colors";
  const mobileNavClass =
    "block w-full text-left text-sm text-zinc-400 hover:text-zinc-100";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-amber-500 rounded-lg group-hover:bg-amber-400 transition-colors">
              <Scissors className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Elite<span className="text-amber-500">Cuts</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavSectionButton
              onClick={() => handleSectionClick("services")}
              className={desktopNavClass}
            >
              Servicios
            </NavSectionButton>
            <NavSectionButton
              onClick={() => handleSectionClick("barbers")}
              className={desktopNavClass}
            >
              Barberos
            </NavSectionButton>
            <NavSectionButton
              onClick={() => handleSectionClick("contact")}
              className={desktopNavClass}
            >
              Contacto
            </NavSectionButton>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  to="/my-appointments"
                  className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Mis turnos
                </Link>
                {profile?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleBooking}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors"
                >
                  <Scissors className="w-4 h-4" />
                  Reservar turno
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <button
                  onClick={handleBooking}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors"
                >
                  Reservar turno
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
          <div className="px-4 py-4 space-y-3">
            <NavSectionButton
              onClick={() => handleSectionClick("services")}
              className={mobileNavClass}
            >
              Servicios
            </NavSectionButton>
            <NavSectionButton
              onClick={() => handleSectionClick("barbers")}
              className={mobileNavClass}
            >
              Barberos
            </NavSectionButton>
            <NavSectionButton
              onClick={() => handleSectionClick("contact")}
              className={mobileNavClass}
            >
              Contacto
            </NavSectionButton>
            {session ? (
              <>
                <Link
                  to="/my-appointments"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm text-zinc-400 hover:text-zinc-100"
                >
                  Mis turnos
                </Link>
                <button
                  onClick={handleBooking}
                  className="w-full px-4 py-2 bg-amber-500 text-zinc-950 text-sm font-semibold rounded-lg"
                >
                  Reservar turno
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left text-sm text-zinc-400 hover:text-zinc-100"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm text-zinc-400 hover:text-zinc-100"
                >
                  Iniciar sesión
                </Link>
                <button
                  onClick={handleBooking}
                  className="w-full px-4 py-2 bg-amber-500 text-zinc-950 text-sm font-semibold rounded-lg"
                >
                  Reservar turno
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
