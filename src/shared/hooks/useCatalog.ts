import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../../services/catalog.service';
import { queryKeys } from '../lib/queryKeys';
import type { Service } from '../types';

export function useCatalog() {
  return useQuery<Service[]>({
    queryKey: queryKeys.catalog.active(),
    queryFn: catalogService.getActive,
    staleTime: 5 * 60 * 1000, // services rarely change — cache 5 min
  });
}
