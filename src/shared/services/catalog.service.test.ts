import { describe, it, expect, vi, beforeEach } from 'vitest';
import { catalogService } from './catalog.service';
import { mockFrom } from '../../test/supabaseMock';

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}));

async function getSupabase() {
  return (await import('../lib/supabase')).supabase;
}

const mockServices = [
  { id: 's1', name: 'beard', label: 'Arreglo de Barba', description: 'Perfilado', duration_minutes: 20, price: 1500, is_active: true },
  { id: 's2', name: 'haircut', label: 'Corte de Cabello', description: 'Cortes modernos', duration_minutes: 30, price: 2500, is_active: true },
  { id: 's3', name: 'facial_cleaning', label: 'Limpieza Facial', description: 'Tratamiento', duration_minutes: 40, price: 3000, is_active: true },
];

describe('catalogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getActive', () => {
    it('returns active services ordered by price', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: mockServices, error: null });

      const result = await catalogService.getActive();

      expect(result).toEqual(mockServices);
      expect(supabase.from).toHaveBeenCalledWith('services');
      expect(chain.eq).toHaveBeenCalledWith('is_active', true);
      expect(chain.order).toHaveBeenCalledWith('price');
    });

    it('returns all three service types', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: mockServices, error: null });

      const result = await catalogService.getActive();
      const names = result.map((s: { name: string }) => s.name);

      expect(names).toContain('haircut');
      expect(names).toContain('beard');
      expect(names).toContain('facial_cleaning');
    });

    it('returns empty array when no active services', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: [], error: null });

      const result = await catalogService.getActive();
      expect(result).toEqual([]);
    });

    it('throws on supabase error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Table not found' } });

      await expect(catalogService.getActive()).rejects.toThrow('Table not found');
    });
  });
});
