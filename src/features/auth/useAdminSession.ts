import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export interface AdminSession {
  session: Session | null;
  isAdmin: boolean;
}

export async function loadAdminSession(): Promise<AdminSession> {
  const { data } = await supabase.auth.getSession();
  const session = data.session ?? null;
  if (!session) return { session: null, isAdmin: false };

  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) return { session, isAdmin: false };
  return { session, isAdmin: Boolean(roles) };
}

export function useAdminSession() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => setVersion((value) => value + 1));
    return () => data.subscription.unsubscribe();
  }, []);

  return useQuery({
    queryKey: ["admin-session", version],
    queryFn: loadAdminSession,
    staleTime: 30_000,
  });
}
