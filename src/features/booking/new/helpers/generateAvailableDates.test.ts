import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateAvailableDates } from './generateAvailableDates';

describe('generateAvailableDates', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('excludes Sundays from the results', () => {
    const dates = generateAvailableDates();
    const sundays = dates.filter((d) => d.getDay() === 0);
    expect(sundays).toHaveLength(0);
  });

  it('returns up to 14 days by default (minus Sundays)', () => {
    const dates = generateAvailableDates();
    // 14 days will have exactly 2 Sundays
    expect(dates.length).toBeGreaterThanOrEqual(12);
    expect(dates.length).toBeLessThanOrEqual(14);
  });

  it('respects custom day count', () => {
    const dates = generateAvailableDates(7);
    // 7 days has at most 1 Sunday
    expect(dates.length).toBeGreaterThanOrEqual(6);
    expect(dates.length).toBeLessThanOrEqual(7);
  });

  it('starts from today', () => {
    const dates = generateAvailableDates();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First date should be today (if not Sunday) or tomorrow
    const first = dates[0];
    expect(first.getTime()).toBeGreaterThanOrEqual(today.getTime());
  });

  it('dates are in ascending order', () => {
    const dates = generateAvailableDates();
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i].getTime()).toBeGreaterThan(dates[i - 1].getTime());
    }
  });

  it('returns empty array for 0 days', () => {
    expect(generateAvailableDates(0)).toHaveLength(0);
  });

  it('excludes Sundays on a known date', () => {
    // 2026-04-05 is a Sunday
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 4)); // Saturday April 4

    const dates = generateAvailableDates(3);
    // Sat Apr 4, Mon Apr 6 (Sunday Apr 5 excluded)
    expect(dates).toHaveLength(2);
    expect(dates[0].getDay()).toBe(6); // Saturday
    expect(dates[1].getDay()).toBe(1); // Monday
  });
});
