import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Filter, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAllAppointments } from '../hooks/useAllAppointments';
import { useUpdateAppointmentStatus } from '../hooks/useUpdateAppointmentStatus';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import type { AppointmentStatus } from '../../../shared/types';

const ALL_STATUSES: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'completed', label: 'Completados' },
  { value: 'cancelled', label: 'Cancelados' },
];

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: 'Pendiente', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: AlertCircle },
  confirmed: { label: 'Confirmado', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', className: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
  completed: { label: 'Completado', className: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: CheckCircle2 },
};

export function AppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const { data: appointments, isLoading } = useAllAppointments(
    statusFilter === 'all' ? undefined : statusFilter
  );
  const updateMutation = useUpdateAppointmentStatus();

  const filtered = appointments?.filter((apt) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      apt.profiles?.full_name?.toLowerCase().includes(q) ||
      apt.barbers?.name?.toLowerCase().includes(q) ||
      apt.services?.label?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Turnos</h1>
        <p className="text-zinc-400 mt-1">Gestión completa de reservas.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por cliente, barbero o servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 focus:border-amber-500 focus:outline-none rounded-xl text-sm text-zinc-100 placeholder-zinc-600"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-zinc-500" />
          {ALL_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === s.value
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-500">No se encontraron turnos.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80">
                <th className="text-left p-4 text-zinc-400 font-medium">Cliente</th>
                <th className="text-left p-4 text-zinc-400 font-medium">Barbero</th>
                <th className="text-left p-4 text-zinc-400 font-medium">Servicio</th>
                <th className="text-left p-4 text-zinc-400 font-medium">Fecha & Hora</th>
                <th className="text-left p-4 text-zinc-400 font-medium">Estado</th>
                <th className="text-left p-4 text-zinc-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((apt) => {
                const statusConf = STATUS_CONFIG[apt.status];
                const StatusIcon = statusConf.icon;
                return (
                  <tr
                    key={apt.id}
                    className="hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{apt.profiles?.full_name ?? '—'}</p>
                      {apt.profiles?.phone && (
                        <p className="text-xs text-zinc-500">{apt.profiles.phone}</p>
                      )}
                    </td>
                    <td className="p-4 text-zinc-300">{apt.barbers?.name ?? '—'}</td>
                    <td className="p-4">
                      <p className="text-zinc-300">{apt.services?.label ?? '—'}</p>
                      <p className="text-xs text-zinc-500">
                        ${apt.services?.price?.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-zinc-300">
                        {format(parseISO(apt.appointment_date), "d MMM yyyy", { locale: es })}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {apt.start_time} – {apt.end_time}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConf.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateMutation.mutate({ id: apt.id, status: 'confirmed' })}
                              className="px-2.5 py-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => updateMutation.mutate({ id: apt.id, status: 'cancelled' })}
                              className="px-2.5 py-1 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateMutation.mutate({ id: apt.id, status: 'completed' })}
                            className="px-2.5 py-1 text-xs bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 rounded-lg transition-colors"
                          >
                            Completar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
