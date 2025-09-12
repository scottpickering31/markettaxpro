// app/(auth)/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Step 1 → go to password step with the email in the URL */
export async function beginPasswordFlow(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) redirect("/sign-in?step=email&error=missing_email");
  redirect(`/sign-in?step=password&email=${encodeURIComponent(email)}`);
}

/** Step 2 → send the email OTP via Supabase */
export async function sendEmailOtp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) redirect("/sign-in?step=email&error=missing_email");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    redirect(
      `/sign-in?step=password&email=${encodeURIComponent(
        email
      )}&error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(`/sign-in?step=otp&email=${encodeURIComponent(email)}`);
}

/** Optional: OAuth unchanged */
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
