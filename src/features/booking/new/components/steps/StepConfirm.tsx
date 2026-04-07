import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Scissors,
  User,
  Calendar,
  Clock,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import type { Barber, Service } from "../../../../../shared/types";
import { addMinutesToTime } from "../../helpers/addMinutesToTime";
import { DetailRow } from "../DetailRow";
import { LoadingSpinner } from "../../../../../shared/components/LoadingSpinner";

interface Props {
  selectedServices: Service[];
  selectedBarber: Barber | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  notes: string;
  onNotesChange: (value: string) => void;
  onConfirm: () => void;
  isPending: boolean;
  error: Error | null;
}

export function StepConfirm({
  selectedServices,
  selectedBarber,
  selectedDate,
  selectedTime,
  notes,
  onNotesChange,
  onConfirm,
  isPending,
  error,
}: Props) {
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration_minutes,
    0,
  );
  const endTime = selectedTime
    ? addMinutesToTime(selectedTime, totalDuration)
    : null;

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Confirmar reserva</h2>
      <p className="text-zinc-400 mb-6">Revisá los detalles de tu turno.</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 mb-6">
        {/* Services */}
        <div className="flex gap-3 text-sm">
          <div className="w-4 h-4 mt-0.5 shrink-0 text-zinc-500">
            <Scissors className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-zinc-500 mb-1">Servicios</p>
            <div className="space-y-1">
              {selectedServices.map((s) => (
                <div key={s.id} className="flex justify-between text-zinc-200">
                  <span>{s.label}</span>
                  <span className="text-zinc-400">
                    ${s.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DetailRow
          label="Barbero"
          value={selectedBarber?.name ?? ""}
          icon={<User className="w-4 h-4" />}
        />
        <DetailRow
          label="Fecha"
          value={
            selectedDate
              ? format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es })
              : ""
          }
          icon={<Calendar className="w-4 h-4" />}
        />
        <DetailRow
          label="Hora"
          value={
            selectedTime && endTime
              ? `${selectedTime} – ${endTime}`
              : (selectedTime ?? "")
          }
          icon={<Clock className="w-4 h-4" />}
        />

        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
          <div>
            <span className="text-zinc-400 text-sm">Total</span>
            <p className="text-xs text-zinc-600">{totalDuration} min</p>
          </div>
          <span className="text-xl font-black text-amber-500">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Notas adicionales{" "}
          <span className="text-zinc-600 font-normal">(opcional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Ej: Me gustaría un degradado de 2 a 3..."
          rows={3}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-500 focus:outline-none rounded-xl text-sm text-zinc-100 placeholder-zinc-600 transition-colors resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-950/50 border border-red-800 rounded-xl mb-4 text-sm text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error instanceof Error
            ? error.message
            : "Error al reservar el turno"}
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-zinc-950 font-bold rounded-xl transition-colors text-lg"
      >
        {isPending ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            Confirmar turno <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
