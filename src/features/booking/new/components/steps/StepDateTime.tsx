import { format, isBefore, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import type { TimeSlot } from "../../../../../shared/types";
import { LoadingSpinner } from "../../../../../shared/components/LoadingSpinner";

interface Props {
  availableDates: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  slots: TimeSlot[] | undefined;
  isLoadingSlots: boolean;
}

export function StepDateTime({
  availableDates,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  slots,
  isLoadingSlots,
}: Props) {
  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Elegí fecha y hora</h2>
      <p className="text-zinc-400 mb-6">
        Horario de atención: Lunes a Viernes 9:00–20:00, Sábados 9:00–18:00.
      </p>

      {/* Date picker */}
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300 mb-3">Fecha</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableDates.map((date) => {
            const isSelected =
              selectedDate &&
              format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const isPast = isBefore(date, startOfToday());
            return (
              <button
                key={date.toISOString()}
                disabled={isPast}
                onClick={() => onSelectDate(date)}
                className={`shrink-0 flex flex-col items-center p-3 min-w-16 rounded-xl border text-sm transition-all ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 text-amber-500"
                    : isPast
                      ? "border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-zinc-300"
                }`}
              >
                <span className="text-xs uppercase">
                  {format(date, "EEE", { locale: es })}
                </span>
                <span className="font-bold text-lg leading-none mt-0.5">
                  {format(date, "d")}
                </span>
                <span className="text-xs">
                  {format(date, "MMM", { locale: es })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-zinc-300 mb-3">
            Horarios –{" "}
            {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
          </p>
          {isLoadingSlots ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : slots && slots.filter((s) => s.available).length === 0 ? (
            <p className="text-zinc-500 text-sm py-4">
              No hay horarios disponibles para este día. Probá con otro.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {slots?.map((slot) =>
                slot.available ? (
                  <button
                    key={slot.time}
                    onClick={() => onSelectTime(slot.time)}
                    className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      selectedTime === slot.time
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-zinc-300"
                    }`}
                  >
                    {slot.time}
                  </button>
                ) : (
                  <div
                    key={slot.time}
                    title="Horario ocupado"
                    className="py-2.5 rounded-lg text-xs font-medium border border-zinc-800/50 bg-zinc-900/30 text-zinc-600 cursor-not-allowed flex flex-col items-center gap-0.5"
                  >
                    <span>{slot.time}</span>
                    <span className="text-[10px] text-zinc-700">Ocupado</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
