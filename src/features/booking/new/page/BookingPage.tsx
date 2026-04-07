import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";

import { useBarbers } from "../../../../shared/hooks/useBarbers";
import { useCatalog } from "../../../../shared/hooks/useCatalog";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { useCreateAppointment } from "../hooks/useCreateAppointment";
import { addMinutesToTime } from "../helpers/addMinutesToTime";
import { generateAvailableDates } from "../helpers/generateAvailableDates";

import { StepService } from "../components/steps/StepService";
import { StepBarber } from "../components/steps/StepBarber";
import { StepDateTime } from "../components/steps/StepDateTime";
import { StepConfirm } from "../components/steps/StepConfirm";
import { StepSuccess } from "../components/steps/StepSuccess";

import type { Barber, Service } from "../../../../shared/types";

const STEP_LABELS = ["Servicios", "Barbero", "Fecha & Hora", "Confirmar"];

type Step = 0 | 1 | 2 | 3 | 4; // 4 = success

export function BookingPage() {
  const [step, setStep] = useState<Step>(0);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration_minutes,
    0,
  );
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const availableDates = generateAvailableDates();

  const { data: services, isLoading: loadingServices } = useCatalog();
  const { data: barbers, isLoading: loadingBarbers } = useBarbers();
  const { data: slots, isLoading: loadingSlots } = useAvailableSlots({
    barberId: selectedBarber?.id ?? null,
    date: dateStr,
    durationMinutes: totalDuration || 30,
  });
  const createAppointment = useCreateAppointment();

  const toggleService = (service: Service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service],
    );
  };

  const selectBarber = (barber: Barber) => {
    setSelectedBarber(barber);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(2);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (
      !selectedBarber ||
      !selectedDate ||
      !selectedTime ||
      selectedServices.length === 0
    )
      return;

    const dateFormatted = format(selectedDate, "yyyy-MM-dd");
    let currentTime = selectedTime;

    try {
      for (const service of selectedServices) {
        const endTime = addMinutesToTime(currentTime, service.duration_minutes);
        await createAppointment.mutateAsync({
          barber_id: selectedBarber.id,
          service_id: service.id,
          appointment_date: dateFormatted,
          start_time: currentTime,
          end_time: endTime,
          notes: notes || null,
        });
        currentTime = endTime;
      }
      setStep(4);
    } catch {
      // error is stored in createAppointment.error
    }
  };

  const handleReset = () => {
    setStep(0);
    setSelectedServices([]);
    setSelectedBarber(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setNotes("");
    createAppointment.reset();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepService
            services={services}
            isLoading={loadingServices}
            selectedServices={selectedServices}
            onToggle={toggleService}
            onNext={() => {
              setSelectedBarber(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setStep(1);
            }}
          />
        );

      case 1:
        return (
          <StepBarber
            barbers={barbers}
            isLoading={loadingBarbers}
            selectedBarber={selectedBarber}
            onSelect={selectBarber}
          />
        );

      case 2:
        return (
          <StepDateTime
            availableDates={availableDates}
            selectedDate={selectedDate}
            onSelectDate={selectDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            slots={slots}
            isLoadingSlots={loadingSlots}
          />
        );

      case 3:
        return (
          <StepConfirm
            selectedServices={selectedServices}
            selectedBarber={selectedBarber}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            notes={notes}
            onNotesChange={setNotes}
            onConfirm={handleConfirm}
            isPending={createAppointment.isPending}
            error={createAppointment.error as Error | null}
          />
        );

      case 4:
        return (
          <StepSuccess
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedBarber={selectedBarber}
            onReset={handleReset}
          />
        );
    }
  };

  const canGoToConfirm =
    step === 2 && selectedDate !== null && selectedTime !== null;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {step < 4 && (
          <>
            {/* Progress stepper */}
            <div className="flex items-center gap-2 mb-10">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      i < step
                        ? "bg-amber-500 text-zinc-950"
                        : i === step
                          ? "bg-amber-500 text-zinc-950 ring-4 ring-amber-500/20"
                          : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs hidden sm:block ${
                      i === step ? "text-zinc-200 font-medium" : "text-zinc-600"
                    }`}
                  >
                    {label}
                  </span>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-1 ${i < step ? "bg-amber-500" : "bg-zinc-800"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="min-h-100">{renderStep()}</div>

            {/* Back / Continue navigation */}
            {step > 0 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
                <button
                  onClick={() => setStep((step - 1) as Step)}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Volver
                </button>
                {canGoToConfirm && (
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm transition-colors"
                  >
                    Continuar <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {step === 4 && renderStep()}
      </div>
    </div>
  );
}
