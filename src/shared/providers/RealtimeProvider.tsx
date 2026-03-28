import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";

interface Props {
  children: ReactNode;
}

export function RealtimeProvider({ children }: Props) {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("realtime:appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["appointments"] });
          queryClient.invalidateQueries({ queryKey: ["metrics"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, queryClient]);

  return <>{children}</>;
}
