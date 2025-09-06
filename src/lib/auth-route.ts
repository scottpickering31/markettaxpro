// lib/auth-route.ts
import { createClient } from "@/lib/supabase/server";

export async function getUserInRoute() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.user;
}
