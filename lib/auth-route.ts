// lib/auth-route.ts
import { getRouteSupabase } from "@/lib/supabase/server";

export async function getUserInRoute() {
  const supabase = getRouteSupabase();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.user;
}
