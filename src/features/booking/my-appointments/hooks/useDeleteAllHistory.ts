import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../../shared/stores/authStore';
import { appointmentsService } from '../../../../shared/services/appointments.service';
import { queryKeys } from '../../../../shared/lib/queryKeys';

/** Permanently deletes all past appointments (completed + cancelled) for the customer. */
export function useDeleteAllHistory() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (ids: string[]) => {
      if (!user) throw new Error('No autenticado');
      return appointmentsService.deleteMany(ids, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.mine(user!.id),
      });
    },
  });
}
