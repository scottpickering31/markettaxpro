// app/(auth)/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function oauth(provider: "google" | "apple" | "azure") {
  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/callback`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error)
    redirect(`/sign-in?step=email&error=${encodeURIComponent(error.message)}`);
}
