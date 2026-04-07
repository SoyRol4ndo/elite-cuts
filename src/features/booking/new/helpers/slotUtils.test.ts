import { describe, it, expect } from 'vitest';
import { toMinutes, generateAllSlots, overlaps } from './slotUtils';

describe('toMinutes', () => {
  it('converts HH:MM to minutes', () => {
    expect(toMinutes('09:00')).toBe(540);
    expect(toMinutes('00:00')).toBe(0);
    expect(toMinutes('12:30')).toBe(750);
    expect(toMinutes('20:00')).toBe(1200);
  });

  it('handles HH:MM:SS format from Supabase', () => {
    expect(toMinutes('09:30:00')).toBe(570);
    expect(toMinutes('14:00:00')).toBe(840);
  });
});

describe('generateAllSlots', () => {
  it('generates 30-min interval slots for a 30-min service', () => {
    const slots = generateAllSlots(30);
    expect(slots[0]).toBe('09:00');
    expect(slots[slots.length - 1]).toBe('19:30');
    // (20:00 - 09:00) = 660 min, 660/30 = 22 slots
    expect(slots).toHaveLength(22);
  });

  it('generates correct slots for a 20-min service', () => {
    const slots = generateAllSlots(20);
    expect(slots[0]).toBe('09:00');
    // Last slot: 19:30 + 20 = 19:50 <= 20:00, so 19:30 is valid
    // Also 19:40 + 20 = 20:00 <= 20:00, so 19:40 is valid... but step is 30
    expect(slots[slots.length - 1]).toBe('19:30');
  });

  it('generates correct slots for a 40-min service', () => {
    const slots = generateAllSlots(40);
    expect(slots[0]).toBe('09:00');
    // Last slot must end by 20:00, so start <= 19:20
    // 19:00 + 40 = 19:40 OK, 19:30 + 40 = 20:10 > 20:00 NOT OK
    expect(slots[slots.length - 1]).toBe('19:00');
  });

  it('generates correct slots for a 60-min service', () => {
    const slots = generateAllSlots(60);
    expect(slots[0]).toBe('09:00');
    // Last slot: 19:00 + 60 = 20:00 OK
    expect(slots[slots.length - 1]).toBe('19:00');
  });

  it('returns no slots if duration exceeds working hours', () => {
    // Working hours: 11h = 660 min
    const slots = generateAllSlots(700);
    expect(slots).toHaveLength(0);
  });

  it('all slots are within working hours (09:00 - 20:00)', () => {
    const slots = generateAllSlots(30);
    for (const slot of slots) {
      const mins = toMinutes(slot);
      expect(mins).toBeGreaterThanOrEqual(9 * 60);
      expect(mins + 30).toBeLessThanOrEqual(20 * 60);
    }
  });
});

describe('overlaps', () => {
  it('detects exact overlap', () => {
    expect(overlaps('10:00', 30, '10:00', '10:30')).toBe(true);
  });

  it('detects partial overlap at the start', () => {
    expect(overlaps('09:30', 30, '09:45', '10:15')).toBe(true);
  });

  it('detects partial overlap at the end', () => {
    expect(overlaps('10:00', 30, '09:30', '10:15')).toBe(true);
  });

  it('detects when slot fully contains booking', () => {
    expect(overlaps('09:00', 60, '09:15', '09:45')).toBe(true);
  });

  it('detects when booking fully contains slot', () => {
    expect(overlaps('10:00', 30, '09:00', '11:00')).toBe(true);
  });

  it('returns false for adjacent non-overlapping (slot ends when booking starts)', () => {
    expect(overlaps('09:00', 30, '09:30', '10:00')).toBe(false);
  });

  it('returns false for adjacent non-overlapping (booking ends when slot starts)', () => {
    expect(overlaps('10:00', 30, '09:00', '10:00')).toBe(false);
  });

  it('returns false for completely separate times', () => {
    expect(overlaps('09:00', 30, '14:00', '14:30')).toBe(false);
  });

  it('handles HH:MM:SS format from Supabase', () => {
    expect(overlaps('10:00', 30, '10:00:00', '10:30:00')).toBe(true);
    expect(overlaps('11:00', 30, '10:00:00', '10:30:00')).toBe(false);
  });
});
