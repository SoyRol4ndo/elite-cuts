import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { useAdminMetrics } from "../hooks/useAdminMetrics";
import { useTodayAppointments } from "../hooks/useTodayAppointments";
import { useUpdateAppointmentStatus } from "../hooks/useUpdateAppointmentStatus";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { MetricCard } from "../components/MetricCard";
import { RevenueCard } from "../components/RevenueCard";
import { TodayAppoimentCard } from "../components/TodayAppoimentCard";

export function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: todayAppointments, isLoading: todayLoading } =
    useTodayAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const updateStatus = (
    id: string,
    status: "pending" | "confirmed" | "cancelled" | "completed",
  ) => {
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
          navigateTo="appointments"
          title="Turnos hoy"
          value={metrics?.today_appointments ?? 0}
          subtitle="Activos y completados"
          icon={Calendar}
          color="amber"
        />
        <MetricCard
          navigateTo="schedule"
          title="Esta semana"
          value={metrics?.week_appointments ?? 0}
          subtitle="Lunes a domingo"
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          navigateTo="appointments"
          title="Pendientes"
          value={metrics?.pending_appointments ?? 0}
          subtitle="Por confirmar"
          icon={Clock}
          color="purple"
        />
        <MetricCard
          navigateTo="customers"
          title="Clientes"
          value={metrics?.total_customers ?? 0}
          subtitle="Registrados"
          icon={Users}
          color="emerald"
        />
      </div>

      {/* Revenue */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <RevenueCard
          title="Ingresos hoy"
          metric={(metrics?.revenue_today ?? 0).toLocaleString()}
          color="amber-500"
        />
        <RevenueCard
          title="Ingresos esta semana"
          metric={(metrics?.revenue_week ?? 0).toLocaleString()}
          color="emerald-500"
        />
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
            {todayAppointments.map((apt, index) => (
              <TodayAppoimentCard
                key={index}
                appoiment={apt}
                updateStatus={updateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
