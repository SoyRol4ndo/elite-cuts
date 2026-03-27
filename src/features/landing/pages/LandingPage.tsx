import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Scissors,
  Clock,
  Star,
  ChevronRight,
  MapPin,
  Phone,
  AtSign,
  Check,
} from "lucide-react";
import { useAuthStore } from "../../../shared/stores/authStore";

const SERVICES = [
  {
    id: "haircut",
    icon: "✂️",
    title: "Corte de Cabello",
    description:
      "Cortes modernos y clásicos adaptados a tu estilo. Desde degradados hasta cortes estructurados.",
    duration: "30 min",
    price: "$2.500",
  },
  {
    id: "beard",
    icon: "🪒",
    title: "Arreglo de Barba",
    description:
      "Perfilado, degradado y acondicionamiento de barba. Terminación con toalla caliente.",
    duration: "20 min",
    price: "$1.500",
  },
  {
    id: "facial",
    icon: "🧴",
    title: "Limpieza Facial",
    description:
      "Tratamiento completo de limpieza, hidratación y exfoliación para una piel sana.",
    duration: "40 min",
    price: "$3.000",
  },
];

const BARBERS = [
  {
    name: "Carlos Méndez",
    specialty: "Especialista en degradados",
    rating: 4.9,
    cuts: 1240,
    initial: "C",
    color: "bg-amber-500",
  },
  {
    name: "Diego Romero",
    specialty: "Cortes clásicos y modernos",
    rating: 4.8,
    cuts: 980,
    initial: "D",
    color: "bg-emerald-500",
  },
  {
    name: "Matías Torres",
    specialty: "Barba y acabados",
    rating: 4.9,
    cuts: 1100,
    initial: "M",
    color: "bg-blue-500",
  },
  {
    name: "Sebastián Vega",
    specialty: "Estilos urbanos",
    rating: 4.7,
    cuts: 860,
    initial: "S",
    color: "bg-purple-500",
  },
  {
    name: "Facundo Ruiz",
    specialty: "Limpieza facial y cuidado",
    rating: 4.8,
    cuts: 920,
    initial: "F",
    color: "bg-rose-500",
  },
];

const FEATURES = [
  "Reserva online 24/7",
  "Sin esperas innecesarias",
  "Barberos certificados",
  "Productos premium",
  "Cancelación sin cargo",
  "Recordatorio por email",
];

export function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuthStore();

  // Scroll to section when arriving with a hash (e.g. navigating from /booking → /#services)
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    // Small delay to ensure the DOM is fully rendered before scrolling
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash]);

  const handleBooking = () => {
    navigate(session ? "/booking" : "/login");
  };

  return (
    <div className="pt-16">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-950/30 via-zinc-950 to-zinc-950" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #d97706 0, #d97706 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Turnos disponibles hoy
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-none">
              Tu mejor <span className="text-amber-500">versión</span>
              <br />
              empieza aquí.
            </h1>

            <p className="text-zinc-400 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
              Barbería premium con 5 profesionales. Reservá tu turno online en
              segundos, sin esperas y con los mejores precios.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBooking}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-105 text-lg"
              >
                <Scissors className="w-5 h-5" />
                Reservar turno
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="#services"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 rounded-xl transition-all text-lg"
              >
                Ver servicios
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: "5", label: "Barberos" },
                { value: "3", label: "Servicios" },
                { value: "+5000", label: "Clientes" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-black text-amber-500">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features strip ─────────────────────────────────────── */}
      <section className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURES.map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-zinc-400">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────── */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">
              Lo que hacemos
            </p>
            <h2 className="text-4xl font-black">Nuestros servicios</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="group p-6 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer"
                onClick={handleBooking}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </div>
                  <span className="text-amber-500 font-bold">
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Barbers ────────────────────────────────────────────── */}
      <section id="barbers" className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">
              El equipo
            </p>
            <h2 className="text-4xl font-black">Nuestros barberos</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {BARBERS.map((barber) => (
              <div
                key={barber.name}
                className="p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all text-center"
              >
                <div
                  className={`w-16 h-16 ${barber.color} rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-4`}
                >
                  {barber.initial}
                </div>
                <h3 className="font-bold text-sm mb-1">{barber.name}</h3>
                <p className="text-zinc-500 text-xs mb-3">{barber.specialty}</p>
                <div className="flex items-center justify-center gap-1 text-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-amber-400 font-semibold">
                    {barber.rating}
                  </span>
                  <span className="text-zinc-600">
                    ({barber.cuts.toLocaleString()})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-linear-to-br from-amber-500/10 to-zinc-900 border border-amber-500/20 rounded-3xl">
            <h2 className="text-4xl font-black mb-4">¿Listo para el cambio?</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              Reservá tu turno ahora y viví la experiencia EliteCuts.
            </p>
            <button
              onClick={handleBooking}
              className="inline-flex items-center gap-2 px-10 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-105 text-lg"
            >
              <Scissors className="w-5 h-5" />
              Reservar mi turno
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer id="contact" className="border-t border-zinc-800 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-amber-500 rounded-lg">
                  <Scissors className="w-4 h-4 text-zinc-950" />
                </div>
                <span className="font-bold">
                  Elite<span className="text-amber-500">Cuts</span>
                </span>
              </div>
              <p className="text-zinc-500 text-sm">
                Barbería premium en el corazón de la ciudad. Calidad y estilo en
                cada visita.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Horarios</h4>
              <div className="space-y-1 text-sm text-zinc-500">
                <p>Lunes – Viernes: 9:00 – 20:00</p>
                <p>Sábados: 9:00 – 18:00</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Av. Corrientes 1234, CABA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <span>+54 11 4567-8901</span>
                </div>
                <div className="flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-amber-500" />
                  <span>@elitecuts.ba</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} EliteCuts. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
