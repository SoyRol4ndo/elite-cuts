import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuthStore } from '../stores/authStore';
import type { User, Session } from '@supabase/supabase-js';

// Capture the auth state change callback
let authCallback: (event: string, session: Session | null) => void;
const mockUnsubscribe = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn((cb) => {
        authCallback = cb;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      }),
    },
    from: vi.fn(),
  },
}));

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  user_metadata: { full_name: 'Juan Perez', phone: '+5411111' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01',
} as User;

const mockSession: Session = {
  access_token: 'token',
  refresh_token: 'refresh',
  user: mockUser,
} as Session;

const mockProfile = {
  id: 'user-123',
  full_name: 'Juan Perez',
  phone: '+5411111',
  role: 'customer',
  created_at: '2026-01-01',
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().reset();
  });

  it('renders children', () => {
    const { getByText } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('subscribes to auth state changes on mount', async () => {
    const { supabase } = await import('../lib/supabase');
    render(
      <AuthProvider>
        <div />
      </AuthProvider>
    );
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledOnce();
  });

  it('sets profile to null and marks initialized when no session', async () => {
    render(
      <AuthProvider>
        <div />
      </AuthProvider>
    );

    // Simulate no session
    authCallback('SIGNED_OUT', null);

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(true);
    });
  });

  it('fetches existing profile on sign in', async () => {
    const { supabase } = await import('../lib/supabase');

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    });
    vi.mocked(supabase.from).mockImplementation(mockFrom);

    render(
      <AuthProvider>
        <div />
      </AuthProvider>
    );

    authCallback('SIGNED_IN', mockSession);

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.profile).toEqual(mockProfile);
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(true);
    });
  });

  it('creates profile when it does not exist (PGRST116)', async () => {
    const { supabase } = await import('../lib/supabase');

    const createdProfile = {
      id: 'user-123',
      full_name: 'Juan Perez',
      phone: '+5411111',
      role: 'customer',
      created_at: '2026-01-01',
    };

    // First call: profile fetch fails with PGRST116 (not found)
    // Second call: upsert succeeds
    let callCount = 0;
    vi.mocked(supabase.from).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // SELECT profiles - not found
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116', message: 'not found' },
              }),
            }),
          }),
        } as never;
      }
      // UPSERT profiles
      return {
        upsert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: createdProfile,
              error: null,
            }),
          }),
        }),
      } as never;
    });

    render(
      <AuthProvider>
        <div />
      </AuthProvider>
    );

    authCallback('SIGNED_IN', mockSession);

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.profile).toEqual(createdProfile);
      expect(state.isLoading).toBe(false);
    });

    // Verify upsert was called (second from() call)
    expect(callCount).toBe(2);
  });

  it('sets profile to null on fetch error (non-PGRST116)', async () => {
    const { supabase } = await import('../lib/supabase');

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: '42501', message: 'permission denied' },
          }),
        }),
      }),
    } as never);

    render(
      <AuthProvider>
        <div />
      </AuthProvider>
    );

    authCallback('SIGNED_IN', mockSession);

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.profile).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(true);
    });
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = render(
      <AuthProvider>
        <div />
      </AuthProvider>
    );
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });
});
