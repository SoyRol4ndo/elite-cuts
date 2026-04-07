import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import type { Appointment } from "../../../../shared/types";

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    icon: AlertCircle,
    className: "text-yellow-400",
  },
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle2,
    className: "text-emerald-400",
  },
  cancelled: { label: "Cancelado", icon: XCircle, className: "text-red-400" },
  completed: {
    label: "Completado",
    icon: CheckCircle2,
    className: "text-zinc-400",
  },
};

interface Props {
  appoiment: Appointment;
  updateStatus: (
    id: string,
    status: "pending" | "confirmed" | "cancelled" | "completed",
  ) => void;
}

export const TodayAppoimentCard = ({ appoiment, updateStatus }: Props) => {
  const statusConf =
    STATUS_CONFIG[appoiment.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConf.icon;
  return (
    <div className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
      {/* Time */}
      <div className="text-center min-w-13">
        <p className="text-sm font-bold">{appoiment.start_time}</p>
        <p className="text-xs text-zinc-500">{appoiment.end_time}</p>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-zinc-800" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {appoiment.profiles?.full_name ?? "Cliente"}
        </p>
        <p className="text-xs text-zinc-500">
          {appoiment.services?.label} · {appoiment.barbers?.name}
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
      {appoiment.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => updateStatus(appoiment.id, "confirmed")}
            className="px-2.5 py-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
          >
            Confirmar
          </button>
          <button
            onClick={() => updateStatus(appoiment.id, "cancelled")}
            className="px-2.5 py-1 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
      {appoiment.status === "confirmed" && (
        <button
          onClick={() => updateStatus(appoiment.id, "completed")}
          className="px-2.5 py-1 text-xs bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 rounded-lg transition-colors"
        >
          Completar
        </button>
      )}
    </div>
  );
};
