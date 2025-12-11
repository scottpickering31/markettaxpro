import { createClient } from "@/lib/supabase/server";

type UpsertParams = {
  userId: string;
  platform: "ebay" | "etsy" | string;
  sellerId: string;
  marketplaceName: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresIn: number; // seconds
};

export async function upsertMarketplaceAccount({
  userId,
  platform,
  sellerId,
  marketplaceName,
  accessToken,
  refreshToken,
  expiresIn,
}: UpsertParams) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("marketplace_accounts")
    .select("id")
    .eq("user_id", userId)
    .eq("platform", platform)
    .eq("seller_id", sellerId)
    .maybeSingle();

  const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  if (existing) {
    // you can either reject or update tokens here
    return { existingId: existing.id, alreadyConnected: true };
  }

  const { error } = await supabase.from("marketplace_accounts").insert({
    user_id: userId,
    platform,
    seller_id: sellerId,
    marketplace_name: marketplaceName,
    access_token: accessToken,
    refresh_token: refreshToken ?? null,
    token_expires_at: tokenExpiresAt,
    status: "active",
    connected_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`[ebay] db_upsert_failed: ${error.message}`);
  }

  return { alreadyConnected: false };
}
