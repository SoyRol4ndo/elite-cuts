import { useQuery } from '@tanstack/react-query';
import { format, startOfToday } from 'date-fns';
import { appointmentsService } from '../../../services/appointments.service';
import { queryKeys } from '../../../shared/lib/queryKeys';
import type { Appointment } from '../../../shared/types';

export function useTodayAppointments() {
  const today = format(startOfToday(), 'yyyy-MM-dd');

  return useQuery<Appointment[]>({
    queryKey: queryKeys.appointments.today(today),
    queryFn: () => appointmentsService.getByDate(today),
    staleTime: 30_000, // 30 seconds
  });
}
