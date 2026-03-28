import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { appointmentsService } from '../../../services/appointments.service';
import { queryKeys } from '../../../shared/lib/queryKeys';
import type { TimeSlot } from '../../../shared/types';

const WORKING_HOURS = { start: 9, end: 20 }; // 09:00 – 20:00

/** Converts "HH:MM" or "HH:MM:SS" to total minutes since midnight. */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Generates all possible slot start times for a given duration within working hours. */
function generateAllSlots(durationMinutes: number): string[] {
  const slots: string[] = [];
  const startMin = WORKING_HOURS.start * 60;
  const endMin = WORKING_HOURS.end * 60;

  for (let min = startMin; min + durationMinutes <= endMin; min += 30) {
    const h = String(Math.floor(min / 60)).padStart(2, '0');
    const m = String(min % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
  }
  return slots;
}

/**
 * Returns true if [slotStart, slotStart + duration) overlaps with [bookedStart, bookedEnd).
 * Handles both "HH:MM" and "HH:MM:SS" formats from Supabase.
 */
function overlaps(
  slotTime: string,
  durationMinutes: number,
  bookedStart: string,
  bookedEnd: string
): boolean {
  const slotStart = toMinutes(slotTime);
  const slotEnd = slotStart + durationMinutes;
  const bStart = toMinutes(bookedStart);
  const bEnd = toMinutes(bookedEnd);
  return slotStart < bEnd && bStart < slotEnd;
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
