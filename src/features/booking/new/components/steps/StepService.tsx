import { Clock, Check, ChevronRight } from "lucide-react";
import type { Service } from "../../../../../shared/types";
import { LoadingSpinner } from "../../../../../shared/components/LoadingSpinner";

interface Props {
  services: Service[] | undefined;
  isLoading: boolean;
  selectedServices: Service[];
  onToggle: (service: Service) => void;
  onNext: () => void;
}

export function StepService({
  services,
  isLoading,
  selectedServices,
  onToggle,
  onNext,
}: Props) {
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration_minutes,
    0,
  );
  const hasSelection = selectedServices.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Elegí los servicios</h2>
      <p className="text-zinc-400 mb-6">
        Podés seleccionar más de uno. Se agendarán de forma consecutiva.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-3">
          {services?.map((service) => {
            const isSelected = selectedServices.some(
              (s) => s.id === service.id,
            );
            return (
              <button
                key={service.id}
                onClick={() => onToggle(service)}
                className={`w-full text-left p-5 border rounded-xl transition-all ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{service.label}</p>
                    <p className="text-sm text-zinc-400 mt-0.5">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" />
                      {service.duration_minutes} min
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xl font-black text-amber-500">
                      ${service.price.toLocaleString()}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-500 text-zinc-950"
                          : "border-zinc-600"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Summary + continue */}
      {hasSelection && (
        <div className="mt-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
          <div className="text-sm text-zinc-400 space-y-0.5">
            <p>
              <span className="text-zinc-200 font-medium">
                {selectedServices.length}
              </span>{" "}
              {selectedServices.length === 1 ? "servicio" : "servicios"} ·{" "}
              {totalDuration} min
            </p>
            <p className="text-xs text-zinc-600">
              {selectedServices.map((s) => s.label).join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-black text-amber-500">
              ${totalPrice.toLocaleString()}
            </span>
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-colors"
            >
              Continuar <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
