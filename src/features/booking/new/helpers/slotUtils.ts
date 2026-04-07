const WORKING_HOURS = { start: 9, end: 20 }; // 09:00 – 20:00

/** Converts "HH:MM" or "HH:MM:SS" to total minutes since midnight. */
export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Generates all possible slot start times for a given duration within working hours. */
export function generateAllSlots(durationMinutes: number): string[] {
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
export function overlaps(
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
