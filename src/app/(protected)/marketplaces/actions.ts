// app/(whatever)/marketplaces/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function selectMarketplaceAction() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("marketplace_accounts")
    .select("id, platform, marketplace_name, connected_at")
    .eq("user_id", user.id)
    .order("connected_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function addMarketplaceAction(input: {
  marketplaceName: string;
  platform: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("marketplace_accounts")
    .insert({
      marketplace_name: input.marketplaceName,
      platform: input.platform,
      user_id: user.id,
    })
    .select("id, marketplace_name, platform")
    .single();

  if (error) throw new Error(error.message);
  return { ok: true, id: data.id, marketplaceName: data.marketplace_name };
}

export async function deleteMarketplaceAction(input: {
  id?: string;
  marketplaceName?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Prefer id; fall back to (user_id + name) if needed
  let q = supabase.from("marketplace_accounts").delete().eq("user_id", user.id);

  if (input.id) {
    q = q.eq("id", input.id);
  } else if (input.marketplaceName) {
    q = q.eq("marketplace_name", input.marketplaceName);
  } else {
    throw new Error("Missing identifier");
  }

  const { error } = await q;
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function renameMarketplaceAction(input: {
  id: string;
  newName: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("marketplace_accounts")
    .update({ marketplace_name: input.newName })
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) {
    if ((error as any).code === "23505") {
      throw new Error("A marketplace with this name already exists.");
    }
    throw new Error(error.message);
  }

  return { ok: true };
}
