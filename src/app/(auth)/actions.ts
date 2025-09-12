"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) {
    redirect("/sign-in?sent=0&error=missing_email");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
    },
  });

  if (error) {
    redirect(`/sign-in?sent=0&error=${encodeURIComponent(error.message)}`);
  }

  redirect("/sign-in?sent=1");
}

export async function oauth(provider: "google" | "apple" | "azure") {
  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });

  if (error) {
    redirect(`/sign-in?sent=0&error=${encodeURIComponent(error.message)}`);
  }
}
