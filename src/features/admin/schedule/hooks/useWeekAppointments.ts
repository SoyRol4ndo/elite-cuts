import { useQuery } from '@tanstack/react-query';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { appointmentsService } from '../../../../shared/services/appointments.service';
import { queryKeys } from '../../../../shared/lib/queryKeys';
import type { Appointment } from '../../../../shared/types';

export function useWeekAppointments(referenceDate: Date) {
  const weekStart = format(
    startOfWeek(referenceDate, { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );
  const weekEnd = format(
    endOfWeek(referenceDate, { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  );

  // Mon–Sat (6 working days)
  const weekDays = Array.from({ length: 6 }, (_, i) =>
    addDays(startOfWeek(referenceDate, { weekStartsOn: 1 }), i)
  );

  const prevWeek = subDays(referenceDate, 7);
  const nextWeek = addDays(referenceDate, 7);

  const query = useQuery<Appointment[]>({
    queryKey: queryKeys.appointments.week(weekStart, weekEnd),
    queryFn: () => appointmentsService.getByWeek(weekStart, weekEnd),
    staleTime: 30_000,
  });

  return { ...query, weekStart, weekEnd, weekDays, prevWeek, nextWeek };
}
