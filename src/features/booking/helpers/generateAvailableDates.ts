import { addDays, startOfToday } from "date-fns";

export const generateAvailableDates = (days = 14): Date[] =>{
  const today = startOfToday();
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(today, i);
    if (d.getDay() !== 0) dates.push(d); // exclude Sundays
  }
  return dates;
}