// app/(whatever)/marketplaces/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function ADD_MARKETPLACE(input: {
  marketplaceName: string;
  platform: string;
}) {
  const supabase = await createClient();

  // Get the signed-in user on the server (don’t trust client userId)
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("Not authenticated");

  const { error } = await supabase.from("marketplace_accounts").insert({
    marketplace_name: input.marketplaceName,
    platform: input.platform,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);
  return { ok: true };
}
