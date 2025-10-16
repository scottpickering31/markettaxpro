// src/data/account.ts
import { createClient } from "@/lib/supabase/server";

export async function getBusinessName(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("profiles")
    .select("business_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[getBusinessName]", error.message);
    return null;
  }
  return data?.business_name ?? null;
}

export async function setBusinessName(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("profiles")
    .update({ business_name: name })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
}
