import { useQuery } from '@tanstack/react-query';
import { appointmentsService } from '../services/appointments.service';
import { queryKeys } from '../lib/queryKeys';

/**
 * Returns the number of appointments awaiting admin action (status = 'pending').
 * staleTime is 0 so it always reflects the latest real-time invalidation immediately.
 */
export function usePendingCount() {
  return useQuery<number>({
    queryKey: queryKeys.appointments.pendingCount(),
    queryFn: () => appointmentsService.getPendingCount(),
    staleTime: 0,
  });
}
