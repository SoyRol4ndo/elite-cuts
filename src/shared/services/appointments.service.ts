import { supabase } from '../lib/supabase';
import type { Appointment, AppointmentStatus } from '../types';

// ── Query helpers ─────────────────────────────────────────────────────────

const WITH_RELATIONS = `
  *,
  profiles (id, full_name, phone),
  barbers   (id, name, specialty),
  services  (id, label, price, duration_minutes)
` as const;

// ── Service ───────────────────────────────────────────────────────────────

export const appointmentsService = {
  /** Returns all appointments for the logged-in customer. */
  getByCustomer: async (customerId: string): Promise<Appointment[]> => {
    const { data, error } = await supabase
      .from('appointments')
      .select(WITH_RELATIONS)
      .eq('customer_id', customerId)
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Appointment[];
  },

  /** Returns all appointments for a specific date (admin). */
  getByDate: async (date: string): Promise<Appointment[]> => {
    const { data, error } = await supabase
      .from('appointments')
      .select(WITH_RELATIONS)
      .eq('appointment_date', date)
      .not('status', 'eq', 'cancelled')
      .order('start_time');

    if (error) throw new Error(error.message);
    return data as Appointment[];
  },

  /** Returns all appointments within a week range (admin). */
  getByWeek: async (weekStart: string, weekEnd: string): Promise<Appointment[]> => {
    const { data, error } = await supabase
      .from('appointments')
      .select(WITH_RELATIONS)
      .gte('appointment_date', weekStart)
      .lte('appointment_date', weekEnd)
      .order('start_time');

    if (error) throw new Error(error.message);
    return data as Appointment[];
  },

  /** Returns all appointments with optional status filter (admin). */
  getAll: async (status?: AppointmentStatus): Promise<Appointment[]> => {
    let query = supabase
      .from('appointments')
      .select(WITH_RELATIONS)
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Appointment[];
  },

  /** Returns booked time slots for a barber on a specific date. */
  getBookedSlots: async (
    barberId: string,
    date: string
  ): Promise<{ start_time: string; end_time: string }[]> => {
    const { data, error } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('barber_id', barberId)
      .eq('appointment_date', date)
      .in('status', ['pending', 'confirmed']);

    if (error) throw new Error(error.message);
    return data;
  },

  /** Creates a new appointment. */
  create: async (payload: {
    customer_id: string;
    barber_id: string;
    service_id: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    notes?: string | null;
  }): Promise<void> => {
    const { error } = await supabase.from('appointments').insert({
      ...payload,
      status: 'pending',
    });

    if (error) throw new Error(error.message);
  },

  /** Updates the status of an appointment. */
  updateStatus: async (
    id: string,
    status: AppointmentStatus
  ): Promise<void> => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  /** Cancels an appointment — restricted to the owning customer. */
  cancel: async (id: string, customerId: string): Promise<void> => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('customer_id', customerId);

    if (error) throw new Error(error.message);
  },

  /** Permanently deletes an appointment record for the owning customer. */
  delete: async (id: string, customerId: string): Promise<void> => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('customer_id', customerId);

    if (error) throw new Error(error.message);
  },

  /** Returns the total count of appointments with status 'pending' (admin). */
  getPendingCount: async (): Promise<number> => {
    const { count, error } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw new Error(error.message);
    return count ?? 0;
  },

  /** Permanently deletes multiple appointment records for the owning customer. */
  deleteMany: async (ids: string[], customerId: string): Promise<void> => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .in('id', ids)
      .eq('customer_id', customerId);

    if (error) throw new Error(error.message);
  },
};
