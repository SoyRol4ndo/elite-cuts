import { supabase } from '../../../../shared/lib/supabase';
import type { Profile } from '../../../../shared/types';

export interface CustomerWithStats extends Profile {
  appointment_count: number;
  last_appointment: string | null;
}

export const customersService = {
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
};
