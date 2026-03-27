
import { supabase } from '../shared/lib/supabase';
import type { Service } from '../shared/types';

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
