import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types';

const mockUser = { id: 'user-123', email: 'test@example.com' } as User;
const mockSession = { access_token: 'token-abc', user: mockUser } as Session;
const mockProfile: Profile = {
  id: 'user-123',
  full_name: 'Juan Perez',
  phone: '+541112345678',
  role: 'customer',
  created_at: '2026-01-01T00:00:00Z',
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  it('reset clears auth data and leaves ready state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isInitialized).toBe(true);
  });

  it('sets user', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toBe(mockUser);
  });

  it('sets session', () => {
    useAuthStore.getState().setSession(mockSession);
    expect(useAuthStore.getState().session).toBe(mockSession);
  });

  it('sets profile', () => {
    useAuthStore.getState().setProfile(mockProfile);
    expect(useAuthStore.getState().profile).toBe(mockProfile);
  });

  it('sets loading state', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('sets initialized state', () => {
    useAuthStore.getState().setInitialized(true);
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });

  it('resets to logged-out state (not loading)', () => {
    const { setUser, setSession, setProfile, setLoading, setInitialized } =
      useAuthStore.getState();

    setUser(mockUser);
    setSession(mockSession);
    setProfile(mockProfile);
    setLoading(false);
    setInitialized(true);

    useAuthStore.getState().reset();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isInitialized).toBe(true);
  });

  it('can set user to null (logout)', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
