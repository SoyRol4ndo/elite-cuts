import { useQuery } from '@tanstack/react-query';
import { profilesService } from '../../../services/profiles.service';
import { queryKeys } from '../../../shared/lib/queryKeys';
import type { CustomerWithStats } from '../../../services/profiles.service';

export function useCustomers() {
  return useQuery<CustomerWithStats[]>({
    queryKey: queryKeys.profiles.customers(),
    queryFn: profilesService.getCustomersWithStats,
  });
}
