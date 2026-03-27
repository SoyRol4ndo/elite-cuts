import { useQuery } from '@tanstack/react-query';
import { appointmentsService } from '../../../services/appointments.service';
import { queryKeys } from '../../../shared/lib/queryKeys';
import type { TimeSlot } from '../../../shared/types';

const WORKING_HOURS = { start: 9, end: 20 }; // 09:00 – 20:00

function generateAllSlots(durationMinutes: number): string[] {
  const slots: string[] = [];
  for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
    for (let min = 0; min < 60; min += durationMinutes) {
      const endMinutes = hour * 60 + min + durationMinutes;
      if (endMinutes / 60 > WORKING_HOURS.end) break;
      const h = String(hour).padStart(2, '0');
      const m = String(min).padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
}

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
      const bookedSet = new Set(booked.map((a) => a.start_time));
      return generateAllSlots(durationMinutes).map((time) => ({
        time,
        available: !bookedSet.has(time),
      }));
    },
    staleTime: 30_000, // 30 seconds — slots change frequently
  });
}
