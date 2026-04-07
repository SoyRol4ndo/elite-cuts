import { useEffect, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";
import type { User } from "@supabase/supabase-js";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setSession, setProfile, setLoading, setInitialized } =
    useAuthStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchOrCreateProfile(session.user);
      } else {
        setProfile(null);
        setLoading(false);
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchOrCreateProfile(user: User) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        return;
      }

      // Profile doesn't exist (trigger may not have fired) — create it
      if (error && error.code === "PGRST116") {
        const meta = user.user_metadata ?? {};
        const { data: created, error: insertError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            full_name: meta.full_name ?? "Usuario",
            phone: meta.phone ?? null,
            role: "customer",
          })
          .select("*")
          .single();

        if (insertError) throw insertError;
        setProfile(created);
        return;
      }

      if (error) throw error;
    } catch (err) {
      console.error("Error fetching/creating profile:", err);
      setProfile(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }

  return <>{children}</>;
}
