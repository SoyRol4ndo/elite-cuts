import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appointmentsService } from './appointments.service';
import { mockFrom } from '../../test/supabaseMock';

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}));

async function getSupabase() {
  return (await import('../lib/supabase')).supabase;
}

describe('appointmentsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── create ────────────────────────────────��─────────────────────────────

  describe('create', () => {
    const validPayload = {
      customer_id: 'user-123',
      barber_id: 'barber-1',
      service_id: 'service-1',
      appointment_date: '2026-04-10',
      start_time: '10:00',
      end_time: '10:30',
    };

    it('succeeds with valid data', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: null });

      await expect(appointmentsService.create(validPayload)).resolves.toBeUndefined();
    });

    it('includes status "pending" in the insert payload', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: null, error: null });

      await appointmentsService.create(validPayload);

      expect(chain.insert).toHaveBeenCalledWith({
        ...validPayload,
        status: 'pending',
      });
    });

    it('passes optional notes to the insert', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: null, error: null });

      const withNotes = { ...validPayload, notes: 'Sin barba' };
      await appointmentsService.create(withNotes);

      expect(chain.insert).toHaveBeenCalledWith(
        expect.objectContaining({ notes: 'Sin barba' })
      );
    });

    it('throws on FK constraint violation (no profile)', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, {
        data: null,
        error: {
          message: 'insert or update on table "appointments" violates foreign key constraint "appointments_customer_id_fkey"',
          code: '23503',
        },
      });

      await expect(
        appointmentsService.create({ ...validPayload, customer_id: 'ghost' })
      ).rejects.toThrow('foreign key constraint');
    });

    it('throws on unique constraint violation (double booking)', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, {
        data: null,
        error: {
          message: 'duplicate key value violates unique constraint "appointments_barber_id_appointment_date_start_time_key"',
          code: '23505',
        },
      });

      await expect(appointmentsService.create(validPayload)).rejects.toThrow(
        'duplicate key'
      );
    });
  });

  // ── getByCustomer ───────────────────────────────────────────────────────

  describe('getByCustomer', () => {
    it('returns appointments for the given customer', async () => {
      const supabase = await getSupabase();
      const appointments = [
        { id: 'a1', customer_id: 'user-123', status: 'pending' },
        { id: 'a2', customer_id: 'user-123', status: 'completed' },
      ];
      mockFrom(supabase, { data: appointments, error: null });

      const result = await appointmentsService.getByCustomer('user-123');

      expect(result).toEqual(appointments);
      expect(supabase.from).toHaveBeenCalledWith('appointments');
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'RLS violation' } });

      await expect(
        appointmentsService.getByCustomer('user-123')
      ).rejects.toThrow('RLS violation');
    });
  });

  // ── getByDate ───────────────────────────────────────────────────────────

  describe('getByDate', () => {
    it('returns non-cancelled appointments for a date', async () => {
      const supabase = await getSupabase();
      const appointments = [{ id: 'a1', appointment_date: '2026-04-10', status: 'pending' }];
      const chain = mockFrom(supabase, { data: appointments, error: null });

      const result = await appointmentsService.getByDate('2026-04-10');

      expect(result).toEqual(appointments);
      expect(chain.not).toHaveBeenCalledWith('status', 'eq', 'cancelled');
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'DB down' } });

      await expect(
        appointmentsService.getByDate('2026-04-10')
      ).rejects.toThrow('DB down');
    });
  });

  // ── getByWeek ───────────────────────────────────────────────────────────

  describe('getByWeek', () => {
    it('returns appointments within a week range', async () => {
      const supabase = await getSupabase();
      const appointments = [
        { id: 'a1', appointment_date: '2026-04-06' },
        { id: 'a2', appointment_date: '2026-04-08' },
      ];
      const chain = mockFrom(supabase, { data: appointments, error: null });

      const result = await appointmentsService.getByWeek('2026-04-06', '2026-04-12');

      expect(result).toEqual(appointments);
      expect(chain.gte).toHaveBeenCalledWith('appointment_date', '2026-04-06');
      expect(chain.lte).toHaveBeenCalledWith('appointment_date', '2026-04-12');
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Timeout' } });

      await expect(
        appointmentsService.getByWeek('2026-04-06', '2026-04-12')
      ).rejects.toThrow('Timeout');
    });
  });

  // ── getAll ──────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('returns all appointments without status filter', async () => {
      const supabase = await getSupabase();
      const appointments = [{ id: 'a1' }, { id: 'a2' }];
      mockFrom(supabase, { data: appointments, error: null });

      const result = await appointmentsService.getAll();
      expect(result).toEqual(appointments);
    });

    it('filters by status when provided', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: [{ id: 'a1', status: 'pending' }], error: null });

      await appointmentsService.getAll('pending');

      expect(chain.eq).toHaveBeenCalledWith('status', 'pending');
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Forbidden' } });

      await expect(appointmentsService.getAll()).rejects.toThrow('Forbidden');
    });
  });

  // ── getBookedSlots ──────────────────────────────────────────────────────

  describe('getBookedSlots', () => {
    it('returns booked slots for a barber on a date', async () => {
      const supabase = await getSupabase();
      const slots = [
        { start_time: '10:00', end_time: '10:30' },
        { start_time: '14:00', end_time: '14:30' },
      ];
      const chain = mockFrom(supabase, { data: slots, error: null });

      const result = await appointmentsService.getBookedSlots('barber-1', '2026-04-10');

      expect(result).toEqual(slots);
      expect(chain.in).toHaveBeenCalledWith('status', ['pending', 'confirmed']);
    });

    it('returns empty array when no bookings', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: [], error: null });

      const result = await appointmentsService.getBookedSlots('barber-1', '2026-04-10');
      expect(result).toEqual([]);
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Connection error' } });

      await expect(
        appointmentsService.getBookedSlots('barber-1', '2026-04-10')
      ).rejects.toThrow('Connection error');
    });
  });

  // ── updateStatus ────────────────────────────────────────────────────────

  describe('updateStatus', () => {
    it('updates appointment status successfully', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: null, error: null });

      await expect(
        appointmentsService.updateStatus('apt-1', 'confirmed')
      ).resolves.toBeUndefined();

      expect(chain.update).toHaveBeenCalledWith({ status: 'confirmed' });
    });

    it('can set status to completed', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: null, error: null });

      await appointmentsService.updateStatus('apt-1', 'completed');
      expect(chain.update).toHaveBeenCalledWith({ status: 'completed' });
    });

    it('throws when not authorized', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Not authorized' } });

      await expect(
        appointmentsService.updateStatus('apt-1', 'confirmed')
      ).rejects.toThrow('Not authorized');
    });
  });

  // ── cancel ──────────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('cancels an appointment for the owning customer', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: null, error: null });

      await expect(
        appointmentsService.cancel('apt-1', 'user-123')
      ).resolves.toBeUndefined();

      expect(chain.update).toHaveBeenCalledWith({ status: 'cancelled' });
      expect(chain.eq).toHaveBeenCalledWith('id', 'apt-1');
      expect(chain.eq).toHaveBeenCalledWith('customer_id', 'user-123');
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Already cancelled' } });

      await expect(
        appointmentsService.cancel('apt-1', 'user-123')
      ).rejects.toThrow('Already cancelled');
    });
  });

  // ── delete ──────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('deletes an appointment for the owning customer', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: null, error: null });

      await expect(
        appointmentsService.delete('apt-1', 'user-123')
      ).resolves.toBeUndefined();

      expect(chain.delete).toHaveBeenCalled();
      expect(chain.eq).toHaveBeenCalledWith('id', 'apt-1');
      expect(chain.eq).toHaveBeenCalledWith('customer_id', 'user-123');
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Not found' } });

      await expect(
        appointmentsService.delete('apt-1', 'user-123')
      ).rejects.toThrow('Not found');
    });
  });

  // ── deleteMany ──────────────────────────────────────────────────────────

  describe('deleteMany', () => {
    it('deletes multiple appointments', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: null, error: null });

      await expect(
        appointmentsService.deleteMany(['apt-1', 'apt-2', 'apt-3'], 'user-123')
      ).resolves.toBeUndefined();

      expect(chain.delete).toHaveBeenCalled();
      expect(chain.in).toHaveBeenCalledWith('id', ['apt-1', 'apt-2', 'apt-3']);
      expect(chain.eq).toHaveBeenCalledWith('customer_id', 'user-123');
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Partial failure' } });

      await expect(
        appointmentsService.deleteMany(['apt-1'], 'user-123')
      ).rejects.toThrow('Partial failure');
    });
  });

  // ── getPendingCount ─────────────────────────────────────────────────────

  describe('getPendingCount', () => {
    it('returns the count of pending appointments', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { count: 5, error: null });

      const count = await appointmentsService.getPendingCount();
      expect(count).toBe(5);
    });

    it('returns 0 when count is null', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { count: null, error: null });

      const count = await appointmentsService.getPendingCount();
      expect(count).toBe(0);
    });

    it('returns 0 when there are no pending appointments', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { count: 0, error: null });

      const count = await appointmentsService.getPendingCount();
      expect(count).toBe(0);
    });

    it('throws on error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Permission denied' } });

      await expect(appointmentsService.getPendingCount()).rejects.toThrow(
        'Permission denied'
      );
    });
  });
});
