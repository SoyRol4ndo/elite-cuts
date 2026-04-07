import { supabase } from '../lib/supabase';
import type { Service } from '../types';

export const catalogService = {
  getActive: async (): Promise<Service[]> => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) throw new Error(error.message);
    return data;
  },
};
