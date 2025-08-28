import { redirect } from "next/navigation";
import { getServerSupabase } from "./supabase/server";

export async function requireUser() {
  const supabase = getServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/sign-in");
  return session.user;
}
