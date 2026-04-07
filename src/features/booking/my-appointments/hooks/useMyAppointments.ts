import { useQuery } from '@tanstack/react-query';
import { appointmentsService } from '../../../../shared/services/appointments.service';
import { queryKeys } from '../../../../shared/lib/queryKeys';
import { useAuthStore } from '../../../../shared/stores/authStore';
import type { Appointment } from '../../../../shared/types';

export function useMyAppointments() {
  const { user } = useAuthStore();

  return useQuery<Appointment[]>({
    queryKey: queryKeys.appointments.mine(user?.id ?? ''),
    enabled: !!user,
    queryFn: () => appointmentsService.getByCustomer(user!.id),
  });
}
