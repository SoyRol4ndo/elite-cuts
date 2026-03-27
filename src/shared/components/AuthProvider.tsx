import { useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setSession, setProfile, setLoading, setInitialized } =
    useAuthStore();

  useEffect(() => {
    // onAuthStateChange fires immediately with the current session on mount,
    // so a separate getSession() call is NOT needed and would cause a lock
    // conflict (NavigatorLockAcquireTimeoutError) since both try to acquire
    // the same internal Supabase auth token lock at the same time.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }

  return <>{children}</>;
}
