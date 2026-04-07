import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../../../shared/hooks/useAuth";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import type { RegisterFormData } from "../../../../shared/types";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const result = await register(formData);
      if (result?.needsEmailConfirmation) {
        // Email confirmation required — show success message and redirect to login
        setSuccess(true);
      } else {
        // Auto-confirmed — user is already logged in, go to booking
        navigate("/booking", { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al registrarse";
      if (msg.includes("already registered")) {
        setError("Este email ya está registrado. Iniciá sesión.");
      } else {
        setError(msg);
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black mb-2">¡Registro exitoso!</h2>
          <p className="text-zinc-400 mb-4">
            Tu registro fue exitoso. Dirigete al login para acceder a tu cuenta
            y empezar a reservar tus turnos.
          </p>
          <Link to="/login" className="text-amber-500 hover:text-amber-400">
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-amber-950/40 via-zinc-900 to-zinc-950 items-center justify-center p-12 border-r border-zinc-800">
        <div className="max-w-sm text-center">
          <div className="p-4 bg-amber-500 rounded-2xl inline-flex mb-6">
            <Scissors className="w-10 h-10 text-zinc-950" />
          </div>
          <h2 className="text-3xl font-black mb-4">
            Unite a Elite<span className="text-amber-500">Cuts</span>
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Creá tu cuenta gratuita y empezá a reservar tus turnos en segundos.
            Sin complicaciones.
          </p>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">Crear cuenta</h1>
            <p className="text-zinc-400">
              ¿Ya tenés cuenta?{" "}
              <Link
                to="/login"
                className="text-amber-500 hover:text-amber-400 font-medium"
              >
                Iniciá sesión
              </Link>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-950/50 border border-red-800 rounded-xl mb-6 text-sm text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-500 focus:outline-none rounded-xl text-sm text-zinc-100 placeholder-zinc-600 transition-colors"
                />
              </div>
            </div>

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
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-500 focus:outline-none rounded-xl text-sm text-zinc-100 placeholder-zinc-600 transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Teléfono{" "}
                <span className="text-zinc-600 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+54 11 1234-5678"
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-zinc-300 mb-1.5"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Repetí tu contraseña"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-500 focus:outline-none rounded-xl text-sm text-zinc-100 placeholder-zinc-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex cursor-pointer items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-zinc-950 font-bold rounded-xl transition-colors mt-2"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Crear cuenta"}
            </button>

            <p className="text-xs text-zinc-600 text-center">
              Al registrarte aceptás nuestros{" "}
              <span className="text-zinc-500">Términos y Condiciones</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
