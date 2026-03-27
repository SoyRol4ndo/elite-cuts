import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Scissors, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../../shared/hooks/useAuth";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import type { LoginFormData } from "../../../shared/types";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string })?.from ?? "/booking";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      if (msg.includes("Invalid login credentials")) {
        setError("Email o contraseña incorrectos.");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-amber-950/40 via-zinc-900 to-zinc-950 items-center justify-center p-12 border-r border-zinc-800">
        <div className="max-w-sm text-center">
          <div className="p-4 bg-amber-500 rounded-2xl inline-flex mb-6">
            <Scissors className="w-10 h-10 text-zinc-950" />
          </div>
          <h2 className="text-3xl font-black mb-4">
            Elite<span className="text-amber-500">Cuts</span>
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Reservá tu turno con los mejores barberos. Rápido, fácil y sin
            esperas.
          </p>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">Bienvenido de vuelta</h1>
            <p className="text-zinc-400">
              ¿No tenés cuenta?{" "}
              <Link
                to="/register"
                className="text-amber-500 hover:text-amber-400 font-medium"
              >
                Registrate gratis
              </Link>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-950/50 border border-red-800 rounded-xl mb-6 text-sm text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-500 focus:outline-none rounded-xl text-sm text-zinc-100 placeholder-zinc-600 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-500 focus:outline-none rounded-xl text-sm text-zinc-100 placeholder-zinc-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-zinc-950 font-bold rounded-xl transition-colors"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
