import { useQuery } from '@tanstack/react-query';
import { format, startOfToday, startOfWeek, endOfWeek } from 'date-fns';
import { profilesService } from '../../../services/profiles.service';
import { queryKeys } from '../../../shared/lib/queryKeys';
import type { AdminMetricsPayload } from '../../../services/profiles.service';

export function useAdminMetrics() {
  const today = format(startOfToday(), 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const query = useQuery<AdminMetricsPayload>({
    queryKey: queryKeys.metrics.admin(today, weekStart, weekEnd),
    queryFn: () => profilesService.getAdminMetrics(today, weekStart, weekEnd),
    staleTime: 60_000, // 1 minute
  });

  return { ...query, today, weekStart, weekEnd };
}
