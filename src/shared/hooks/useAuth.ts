import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import type { LoginFormData, RegisterFormData } from '../types';

export function useAuth() {
  const navigate = useNavigate();
  const { user, session, profile, isLoading, isInitialized } = useAuthStore();
  const { setLoading, reset } = useAuthStore();

  const isAuthenticated = !!session;
  const isAdmin = profile?.role === 'admin';
  const isCustomer = profile?.role === 'customer';

  const login = useCallback(
    async ({ email, password }: LoginFormData) => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Navigation is handled by the auth listener in AuthProvider
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const register = useCallback(
    async ({ full_name, email, phone, password }: RegisterFormData) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name, phone },
          },
        });
        if (error) throw error;

        // Return whether the user was auto-confirmed (has a session)
        // vs needs email confirmation (no session)
        return { needsEmailConfirmation: !data.session };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    reset();
    navigate('/');
  }, [navigate, reset]);

  return {
    user,
    session,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated,
    isAdmin,
    isCustomer,
    login,
    register,
    logout,
  };
}
