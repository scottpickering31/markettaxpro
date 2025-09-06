import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/sign-in");
  return session.user;
}
