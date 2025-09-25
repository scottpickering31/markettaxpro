// app/(auth)/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function oauth(provider: "google" | "azure" | "facebook") {
  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) {
    redirect(`/sign-in?step=email&error=${encodeURIComponent(error.message)}`);
  }
  if (data?.url) {
    redirect(data.url);
  }
  redirect(
    `/sign-in?step=email&error=${encodeURIComponent(
      "Unexpected authentication response"
    )}`
  );
}

export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  await supabase.auth.signOut().catch(() => {});

  const admin = createAdminClient(SUPABASE_URL, SERVICE_ROLE);
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    throw new Error(error.message);
  }

  redirect("/sign-in");
}
