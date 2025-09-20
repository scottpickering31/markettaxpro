// app/(auth)/actions.localPassword.ts
"use server";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { hash as argon2Hash } from "@node-rs/argon2";

const PEPPER = process.env.PASSWORD_PEPPER!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Returns true if we’ve previously stored a local/peppered hash for this email.
 * Implementation reads our own `user_passwords` table by email (no PII beyond email).
 * Uses service role to avoid exposing read policies publicly.
 */
export async function checkHasLocalPassword(email: string): Promise<boolean> {
  if (!email) return false;
  const admin = createAdminClient(SUPABASE_URL, SERVICE_ROLE);
  const { data, error } = await admin
    .from("user_passwords")
    .select("email")
    .eq("email", email.toLowerCase())
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows
    console.error("checkHasLocalPassword error", error);
  }
  return Boolean(data);
}

/**
 * After we have a session via OTP, set the Supabase auth password,
 * and store our own peppered hash in `user_passwords`.
 *
 * Returns {ok:true} on success (no redirect).
 */
export async function finalizeLocalPassword(password: string) {
  if (!password || password.length < 8) {
    throw new Error("Weak password");
  }

  // This client reads the existing session via cookies
  const supabase = await createServerClient();

  // 1) Who is logged in?
  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();
  if (uErr || !user) throw new Error("Not authenticated");

  // 2) Set Supabase auth password
  const { error: updErr } = await supabase.auth.updateUser({ password });
  if (updErr) throw updErr;

  // 3) Pepper + hash locally and upsert
  const hash = await argon2Hash(password + PEPPER, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const { error: dbErr } = await supabase.from("user_passwords").upsert({
    user_id: user.id,
    email: (user.email ?? "").toLowerCase(),
    password_hash: hash,
    set_at: new Date().toISOString(),
    version: 1,
  });
  if (dbErr) throw dbErr;

  return { ok: true as const };
}
