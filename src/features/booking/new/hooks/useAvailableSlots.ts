import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { appointmentsService } from '../../../../shared/services/appointments.service';
import { queryKeys } from '../../../../shared/lib/queryKeys';
import { toMinutes, generateAllSlots, overlaps } from '../helpers/slotUtils';
import type { TimeSlot } from '../../../../shared/types';

interface UseAvailableSlotsParams {
  barberId: string | null;
  date: string | null; // 'YYYY-MM-DD'
  durationMinutes: number;
}

export function useAvailableSlots({
  barberId,
  date,
  durationMinutes,
}: UseAvailableSlotsParams) {
  return useQuery<TimeSlot[]>({
    queryKey: queryKeys.appointments.slots(
      barberId ?? '',
      date ?? '',
      durationMinutes
    ),
    enabled: !!barberId && !!date && durationMinutes > 0,
    queryFn: async () => {
      const booked = await appointmentsService.getBookedSlots(barberId!, date!);

      // If the selected date is today, reject slots that are already in the past
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const isToday = date === todayStr;
      const nowMinutes = isToday
        ? new Date().getHours() * 60 + new Date().getMinutes()
        : -1;

      return generateAllSlots(durationMinutes).map((time) => {
        const isPast = isToday && toMinutes(time) <= nowMinutes;
        const isBooked = booked.some((b) =>
          overlaps(time, durationMinutes, b.start_time, b.end_time)
        );
        return { time, available: !isPast && !isBooked };
      });
    },
    staleTime: 30_000,
  });
}
