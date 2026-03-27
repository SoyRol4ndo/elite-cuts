import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  Scissors,
  User,
  Plus,
  XCircle,
  AlertCircle,
} from 'lucide-react';

import { useMyAppointments } from '../hooks/useMyAppointments';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import type { Appointment, AppointmentStatus } from '../../../shared/types';

// ── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  pending:   { label: 'Pendiente',  className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  confirmed: { label: 'Confirmado', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelado',  className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  completed: { label: 'Completado', className: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
};

// ── Page ───────────────────────────────────────────────────────────────────

export function MyAppointmentsPage() {
  const navigate = useNavigate();
  const { data: appointments, isLoading } = useMyAppointments();
  const cancelAppointment = useCancelAppointment();

  const upcoming = appointments?.filter((a) =>
    ['pending', 'confirmed'].includes(a.status)
  );
  const past = appointments?.filter((a) =>
    ['cancelled', 'completed'].includes(a.status)
  );

  const handleCancel = (id: string) => {
    if (window.confirm('¿Estás seguro de que querés cancelar este turno?')) {
      cancelAppointment.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">Mis turnos</h1>
            <p className="text-zinc-400 mt-1">Gestioná tus reservas en EliteCuts.</p>
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo turno
          </button>
        </div>

        {/* Upcoming */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Próximos turnos
            {upcoming && upcoming.length > 0 && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs rounded-full">
                {upcoming.length}
              </span>
            )}
          </h2>

          {!upcoming || upcoming.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
              <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500">No tenés turnos próximos.</p>
              <button
                onClick={() => navigate('/booking')}
                className="mt-3 text-amber-500 hover:text-amber-400 text-sm font-medium"
              >
                Reservar ahora →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onCancel={handleCancel}
                  isCancelling={cancelAppointment.isPending}
                />
              ))}
            </div>
          )}
        </section>

        {/* History */}
        {past && past.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 text-zinc-500">Historial</h2>
            <div className="space-y-3">
              {past.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  readonly
                  isCancelling={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────

function AppointmentCard({
  appointment: apt,
  onCancel,
  readonly = false,
  isCancelling,
}: {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  readonly?: boolean;
  isCancelling: boolean;
}) {
  const statusConfig = STATUS_CONFIG[apt.status];

  return (
    <div
      className={`p-5 border rounded-2xl transition-all ${
        readonly
          ? 'border-zinc-800 bg-zinc-900/50 opacity-70'
          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusConfig.className}`}
          >
            {statusConfig.label}
          </span>

          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-zinc-300">
              <Scissors className="w-3.5 h-3.5 text-amber-500" />
              {apt.services?.label ?? 'Servicio'}
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <User className="w-3.5 h-3.5 text-amber-500" />
              {apt.barbers?.name ?? 'Barbero'}
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
              {format(parseISO(apt.appointment_date), "EEEE d 'de' MMMM", { locale: es })}
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              {apt.start_time} – {apt.end_time}
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-lg font-black text-amber-500">
            ${apt.services?.price?.toLocaleString()}
          </p>
          {!readonly && onCancel && (
            <button
              onClick={() => onCancel(apt.id)}
              disabled={isCancelling}
              className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancelar
            </button>
          )}
        </div>
      </div>

      {apt.notes && (
        <div className="mt-3 pt-3 border-t border-zinc-800 flex items-start gap-2 text-xs text-zinc-500">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {apt.notes}
        </div>
      )}
    </div>
  );
}
