import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '../../../services/appointments.service';
import { queryKeys } from '../../../shared/lib/queryKeys';
import { useAuthStore } from '../../../shared/stores/authStore';

export function useCancelAppointment() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => {
      if (!user) throw new Error('Usuario no autenticado.');
      return appointmentsService.cancel(appointmentId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.mine(user?.id ?? ''),
      });
    },
  });
}
