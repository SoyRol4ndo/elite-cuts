import { supabase } from '../lib/supabase';
import type { Barber } from '../types';

export const barbersService = {
  /** Returns all active barbers ordered by name. */
  getActive: async (): Promise<Barber[]> => {
    const { data, error } = await supabase
      .from('barbers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw new Error(error.message);
    return data;
  },

  /** Returns all barbers (active and inactive) — for admin use. */
  getAll: async (): Promise<Barber[]> => {
    const { data, error } = await supabase
      .from('barbers')
      .select('*')
      .order('name');

    if (error) throw new Error(error.message);
    return data;
  },
};
