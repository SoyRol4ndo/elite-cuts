import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import type { Barber } from "../../../../shared/types";

interface Props {
  barbers: Barber[] | undefined;
  isLoading: boolean;
  selectedBarber: Barber | null;
  onSelect: (barber: Barber) => void;
}

export function StepBarber({
  barbers,
  isLoading,
  selectedBarber,
  onSelect,
}: Props) {
  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Elegí un barbero</h2>
      <p className="text-zinc-400 mb-6">
        Todos nuestros barberos son profesionales certificados.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {barbers?.map((barber) => (
            <button
              key={barber.id}
              onClick={() => onSelect(barber)}
              className={`text-left p-5 border rounded-xl transition-all ${
                selectedBarber?.id === barber.id
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-lg font-black shrink-0">
                  {barber.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{barber.name}</p>
                  <p className="text-sm text-zinc-400">{barber.specialty}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
