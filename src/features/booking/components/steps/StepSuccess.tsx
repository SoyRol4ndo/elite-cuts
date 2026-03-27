import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Barber } from '../../../shared/types';

interface Props {
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedBarber: Barber | null;
  onReset: () => void;
}

export function StepSuccess({ selectedDate, selectedTime, selectedBarber, onReset }: Props) {
  const navigate = useNavigate();

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </div>
      <h2 className="text-3xl font-black mb-3">¡Turno reservado!</h2>
      <p className="text-zinc-400 mb-2">Tu turno fue reservado exitosamente.</p>
      <p className="text-sm text-zinc-500 mb-8">
        {selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}{' '}
        a las {selectedTime} con {selectedBarber?.name}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate('/my-appointments')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-colors"
        >
          Ver mis turnos
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-xl transition-colors"
        >
          Reservar otro turno
        </button>
      </div>
    </div>
  );
}
