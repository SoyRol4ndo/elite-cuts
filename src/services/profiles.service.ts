import { supabase } from '../shared/lib/supabase';
import type { Profile } from '../shared/types';

export interface CustomerWithStats extends Profile {
  appointment_count: number;
  last_appointment: string | null;
}

// ── Metrics payload ───────────────────────────────────────────────────────

export interface AdminMetricsPayload {
  today_appointments: number;
  week_appointments: number;
  pending_appointments: number;
  total_customers: number;
  revenue_today: number;
  revenue_week: number;
}

// ── Service ───────────────────────────────────────────────────────────────

export const profilesService = {
  /** Returns all customer profiles. */
  getCustomers: async (): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  /** Returns customers with their appointment count and last visit date. */
  getCustomersWithStats: async (): Promise<CustomerWithStats[]> => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const customers = await Promise.all(
      (profiles ?? []).map(async (profile) => {
        const { count, data } = await supabase
          .from('appointments')
          .select('appointment_date', { count: 'exact' })
          .eq('customer_id', profile.id)
          .not('status', 'eq', 'cancelled')
          .order('appointment_date', { ascending: false })
          .limit(1);

        return {
          ...profile,
          appointment_count: count ?? 0,
          last_appointment: data?.[0]?.appointment_date ?? null,
        };
      })
    );

    return customers;
  },

  /** Returns aggregated dashboard metrics for the admin. */
  getAdminMetrics: async (
    today: string,
    weekStart: string,
    weekEnd: string
  ): Promise<AdminMetricsPayload> => {
    const [todayRes, weekRes, pendingRes, customersRes, revenueTodayRes] =
      await Promise.all([
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .eq('appointment_date', today)
          .in('status', ['pending', 'confirmed', 'completed']),

        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .gte('appointment_date', weekStart)
          .lte('appointment_date', weekEnd)
          .in('status', ['pending', 'confirmed', 'completed']),

        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .eq('status', 'pending'),

        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('role', 'customer'),

        supabase
          .from('appointments')
          .select('services(price)')
          .eq('appointment_date', today)
          .eq('status', 'completed'),
      ]);

    const revenueToday = (revenueTodayRes.data ?? []).reduce((sum, a) => {
      const svc = a.services as { price?: number } | null;
      return sum + (svc?.price ?? 0);
    }, 0);

    // Weekly revenue — only completed appointments represent actual income
    const weekRevenueRes = await supabase
      .from('appointments')
      .select('services(price)')
      .gte('appointment_date', weekStart)
      .lte('appointment_date', weekEnd)
      .eq('status', 'completed');

    const revenueWeek = (weekRevenueRes.data ?? []).reduce((sum, a) => {
      const svc = a.services as { price?: number } | null;
      return sum + (svc?.price ?? 0);
    }, 0);

    return {
      today_appointments: todayRes.count ?? 0,
      week_appointments: weekRes.count ?? 0,
      pending_appointments: pendingRes.count ?? 0,
      total_customers: customersRes.count ?? 0,
      revenue_today: revenueToday,
      revenue_week: revenueWeek,
    };
  },
};
