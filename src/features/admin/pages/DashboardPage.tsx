import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useAdminMetrics } from '../hooks/useAdminMetrics';
import { useTodayAppointments } from '../hooks/useTodayAppointments';
import { useUpdateAppointmentStatus } from '../hooks/useUpdateAppointmentStatus';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'amber',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  color?: 'amber' | 'emerald' | 'blue' | 'purple';
}) {
  const colorMap = {
    amber: 'text-amber-500 bg-amber-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
  };

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    icon: AlertCircle,
    className: 'text-yellow-400',
  },
  confirmed: {
    label: 'Confirmado',
    icon: CheckCircle2,
    className: 'text-emerald-400',
  },
  cancelled: { label: 'Cancelado', icon: XCircle, className: 'text-red-400' },
  completed: {
    label: 'Completado',
    icon: CheckCircle2,
    className: 'text-zinc-400',
  },
};

export function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: todayAppointments, isLoading: todayLoading } = useTodayAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const updateStatus = (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    updateStatusMutation.mutate({ id, status });
  };

  const isLoading = metricsLoading || todayLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          {format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Turnos hoy"
          value={metrics?.today_appointments ?? 0}
          subtitle="Activos y completados"
          icon={Calendar}
          color="amber"
        />
        <MetricCard
          title="Esta semana"
          value={metrics?.week_appointments ?? 0}
          subtitle="Lunes a domingo"
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title="Pendientes"
          value={metrics?.pending_appointments ?? 0}
          subtitle="Por confirmar"
          icon={Clock}
          color="purple"
        />
        <MetricCard
          title="Clientes"
          value={metrics?.total_customers ?? 0}
          subtitle="Registrados"
          icon={Users}
          color="emerald"
        />
      </div>

      {/* Revenue */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="p-6 bg-gradient-to-br from-amber-950/30 to-zinc-900 border border-amber-500/20 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-500 mb-3">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Ingresos hoy</span>
          </div>
          <p className="text-4xl font-black">
            ${(metrics?.revenue_today ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-gradient-to-br from-emerald-950/30 to-zinc-900 border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-500 mb-3">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Ingresos esta semana</span>
          </div>
          <p className="text-4xl font-black">
            ${(metrics?.revenue_week ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Today's schedule */}
      <div>
        <h2 className="text-xl font-bold mb-4">Agenda de hoy</h2>
        {!todayAppointments || todayAppointments.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
            <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500">No hay turnos para hoy.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((apt) => {
              const statusConf =
                STATUS_CONFIG[apt.status as keyof typeof STATUS_CONFIG];
              const StatusIcon = statusConf.icon;
              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl"
                >
                  {/* Time */}
                  <div className="text-center min-w-[52px]">
                    <p className="text-sm font-bold">{apt.start_time}</p>
                    <p className="text-xs text-zinc-500">{apt.end_time}</p>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-10 bg-zinc-800" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {apt.profiles?.full_name ?? 'Cliente'}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {apt.services?.label} · {apt.barbers?.name}
                    </p>
                  </div>

                  {/* Status */}
                  <div
                    className={`flex items-center gap-1.5 text-xs ${statusConf.className}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConf.label}
                  </div>

                  {/* Actions */}
                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(apt.id, 'confirmed')}
                        className="px-2.5 py-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => updateStatus(apt.id, 'cancelled')}
                        className="px-2.5 py-1 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(apt.id, 'completed')}
                      className="px-2.5 py-1 text-xs bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 rounded-lg transition-colors"
                    >
                      Completar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
