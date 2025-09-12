"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { hash as argon2Hash } from "@node-rs/argon2";

const PEPPER = process.env.PASSWORD_PEPPER!;

export async function setLocalPassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    redirect("/sign-in?step=password&error=weak_password");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();
  if (uErr || !user) redirect("/sign-in?step=email&error=not_authenticated");

  // hash with pepper (argon2id example)
  const hash = await argon2Hash(password + PEPPER, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  // upsert row
  const { error: dbErr } = await supabase.from("user_passwords").upsert({
    user_id: user.id,
    password_hash: hash,
    set_at: new Date().toISOString(),
    version: 1,
  });

  if (dbErr) {
    redirect("/sign-in?step=password&error=save_failed");
  }

  redirect("/");
}
