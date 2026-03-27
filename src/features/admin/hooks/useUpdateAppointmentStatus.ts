import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '../../../services/appointments.service';
import { queryKeys } from '../../../shared/lib/queryKeys';
import type { AppointmentStatus } from '../../../shared/types';

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: AppointmentStatus;
    }) => appointmentsService.updateStatus(id, status),

    onSuccess: () => {
      // Invalidate all appointment-related queries so every view refreshes
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all() });
      // Invalidate all metrics queries (prefix match — dates vary by page)
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
