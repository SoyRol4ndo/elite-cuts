import { useQuery } from '@tanstack/react-query';
import { barbersService } from '../../services/barbers.service';
import { queryKeys } from '../lib/queryKeys';
import type { Barber } from '../types';

export function useBarbers() {
  return useQuery<Barber[]>({
    queryKey: queryKeys.barbers.active(),
    queryFn: barbersService.getActive,
    staleTime: 5 * 60 * 1000, // barbers rarely change — cache 5 min
  });
}
