import { useQuery } from '@tanstack/react-query';
import { appointmentsService } from '../../../../shared/services/appointments.service';
import { queryKeys } from '../../../../shared/lib/queryKeys';
import type { Appointment, AppointmentStatus } from '../../../../shared/types';

export function useAllAppointments(status?: AppointmentStatus) {
  return useQuery<Appointment[]>({
    queryKey: queryKeys.appointments.list(status),
    queryFn: () => appointmentsService.getAll(status),
  });
}
