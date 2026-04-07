import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../../shared/stores/authStore';
import { appointmentsService } from '../../../../shared/services/appointments.service';
import { queryKeys } from '../../../../shared/lib/queryKeys';

/** Permanently deletes a single past appointment from the customer's history. */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (id: string) => {
      if (!user) throw new Error('No autenticado');
      return appointmentsService.delete(id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.mine(user!.id),
      });
    },
  });
}
