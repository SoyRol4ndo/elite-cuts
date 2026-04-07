import { describe, it, expect, vi, beforeEach } from 'vitest';
import { barbersService } from './barbers.service';
import { mockFrom } from '../../test/supabaseMock';

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}));

async function getSupabase() {
  return (await import('../lib/supabase')).supabase;
}

const mockBarbers = [
  { id: 'b1', name: 'Carlos Méndez', specialty: 'Degradados', avatar_url: null, is_active: true, created_at: '2026-01-01' },
  { id: 'b2', name: 'Diego Romero', specialty: 'Cortes clásicos', avatar_url: null, is_active: true, created_at: '2026-01-01' },
];

describe('barbersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getActive', () => {
    it('returns active barbers', async () => {
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: mockBarbers, error: null });

      const result = await barbersService.getActive();

      expect(result).toEqual(mockBarbers);
      expect(supabase.from).toHaveBeenCalledWith('barbers');
      expect(chain.eq).toHaveBeenCalledWith('is_active', true);
      expect(chain.order).toHaveBeenCalledWith('name');
    });

    it('returns empty array when no active barbers', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: [], error: null });

      const result = await barbersService.getActive();
      expect(result).toEqual([]);
    });

    it('throws on supabase error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Connection refused' } });

      await expect(barbersService.getActive()).rejects.toThrow('Connection refused');
    });
  });

  describe('getAll', () => {
    it('returns all barbers including inactive', async () => {
      const allBarbers = [
        ...mockBarbers,
        { id: 'b3', name: 'Inactivo', specialty: 'None', avatar_url: null, is_active: false, created_at: '2026-01-01' },
      ];
      const supabase = await getSupabase();
      const chain = mockFrom(supabase, { data: allBarbers, error: null });

      const result = await barbersService.getAll();

      expect(result).toEqual(allBarbers);
      expect(result).toHaveLength(3);
      expect(chain.order).toHaveBeenCalledWith('name');
    });

    it('throws on supabase error', async () => {
      const supabase = await getSupabase();
      mockFrom(supabase, { data: null, error: { message: 'Forbidden' } });

      await expect(barbersService.getAll()).rejects.toThrow('Forbidden');
    });
  });
});
