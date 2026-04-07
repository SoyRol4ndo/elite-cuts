import { useQuery } from '@tanstack/react-query';
import { customersService } from '../services/customers.service';
import { queryKeys } from '../../../../shared/lib/queryKeys';
import type { CustomerWithStats } from '../services/customers.service';

export function useCustomers() {
  return useQuery<CustomerWithStats[]>({
    queryKey: queryKeys.profiles.customers(),
    queryFn: customersService.getCustomersWithStats,
  });
}
