import { describe, it, expect } from 'vitest';
import { addMinutesToTime } from './addMinutesToTime';

describe('addMinutesToTime', () => {
  it('adds minutes within the same hour', () => {
    expect(addMinutesToTime('09:00', 20)).toBe('09:20');
  });

  it('rolls over to the next hour', () => {
    expect(addMinutesToTime('09:45', 30)).toBe('10:15');
  });

  it('handles exact hour boundary', () => {
    expect(addMinutesToTime('09:30', 30)).toBe('10:00');
  });

  it('handles adding zero minutes', () => {
    expect(addMinutesToTime('14:30', 0)).toBe('14:30');
  });

  it('handles large durations spanning multiple hours', () => {
    expect(addMinutesToTime('09:00', 120)).toBe('11:00');
  });

  it('pads single-digit hours and minutes', () => {
    expect(addMinutesToTime('08:05', 10)).toBe('08:15');
  });

  it('handles midnight rollover (edge case for late hours)', () => {
    expect(addMinutesToTime('23:30', 60)).toBe('24:30');
  });

  it('handles end of working day scenario', () => {
    expect(addMinutesToTime('19:30', 30)).toBe('20:00');
  });
});
