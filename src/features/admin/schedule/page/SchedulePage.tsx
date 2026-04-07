import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useWeekAppointments } from "../hooks/useWeekAppointments";
import { useBarbers } from "../../../../shared/hooks/useBarbers";
import { useUpdateAppointmentStatus } from "../hooks/useUpdateAppointmentStatus";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9); // 9–19

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
  confirmed: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
  cancelled:
    "bg-red-500/10 border-red-500/20 text-red-400 line-through opacity-50",
  completed: "bg-zinc-700/40 border-zinc-600/40 text-zinc-400",
};

export function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    data: appointments,
    isLoading,
    weekStart,
    weekEnd,
    weekDays,
    prevWeek,
    nextWeek,
  } = useWeekAppointments(currentDate);

  const { data: barbers } = useBarbers();
  const updateStatusMutation = useUpdateAppointmentStatus();

  // Group appointments by date and barber
  const getAppointmentsForSlot = (
    barberId: string,
    date: Date,
    hour: number,
  ) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return (
      appointments?.filter((apt) => {
        const aptHour = parseInt(apt.start_time.split(":")[0]);
        return (
          apt.barber_id === barberId &&
          apt.appointment_date === dateStr &&
          aptHour === hour
        );
      }) ?? []
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Agenda</h1>
          <p className="text-zinc-400 mt-1">
            Semana del{" "}
            {format(parseISO(weekStart), "d 'de' MMMM", { locale: es })} al{" "}
            {format(parseISO(weekEnd), "d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(prevWeek)}
            className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Hoy
          </button>
          <button
            onClick={() => setCurrentDate(nextWeek)}
            className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm min-w-225">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="w-16 p-3 text-left text-zinc-500 font-medium bg-zinc-900/80">
                  Hora
                </th>
                {weekDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className={`p-3 text-center bg-zinc-900/80 ${
                      format(day, "yyyy-MM-dd") ===
                      format(new Date(), "yyyy-MM-dd")
                        ? "text-amber-400"
                        : "text-zinc-300"
                    }`}
                  >
                    <div className="font-bold">
                      {format(day, "EEE", { locale: es })}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {format(day, "d MMM", { locale: es })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr
                  key={hour}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="p-3 text-zinc-600 font-mono text-xs bg-zinc-900/30">
                    {String(hour).padStart(2, "0")}:00
                  </td>
                  {weekDays.map((day) => {
                    const slotApts =
                      barbers?.flatMap((barber) =>
                        getAppointmentsForSlot(barber.id, day, hour).map(
                          (apt) => ({ apt, barber }),
                        ),
                      ) ?? [];

                    return (
                      <td
                        key={day.toISOString()}
                        className="p-1.5 align-top min-h-15"
                      >
                        <div className="space-y-1">
                          {slotApts.map(({ apt }) => (
                            <div
                              key={apt.id}
                              className={`px-2 py-1.5 rounded-lg border text-xs cursor-pointer transition-all hover:opacity-80 ${
                                STATUS_COLORS[apt.status] ??
                                STATUS_COLORS.pending
                              }`}
                              title={`${apt.profiles?.full_name} – ${apt.services?.label}`}
                            >
                              <p className="font-semibold truncate">
                                {apt.profiles?.full_name ?? "Cliente"}
                              </p>
                              <p className="text-[10px] opacity-70 truncate">
                                {apt.barbers?.name} · {apt.services?.label}
                              </p>
                              {apt.status === "pending" && (
                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatusMutation.mutate({
                                        id: apt.id,
                                        status: "confirmed",
                                      });
                                    }}
                                    className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatusMutation.mutate({
                                        id: apt.id,
                                        status: "cancelled",
                                      });
                                    }}
                                    className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
        {Object.entries({
          pending: "Pendiente",
          confirmed: "Confirmado",
          completed: "Completado",
          cancelled: "Cancelado",
        }).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className={`w-3 h-3 rounded border ${STATUS_COLORS[status]}`}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
