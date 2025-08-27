import { NextResponse } from "next/server";
import { getRouteSupabase } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect("/(app)/connect?error=missing_code");

  // Exchange code → token (fetch to Etsy token endpoint)
  // Store credentials in a secure table/kv (not included here)
  // Create marketplace_accounts row
  const supabase = getRouteSupabase();
  await supabase.from("marketplace_accounts").insert({
    user_id: user.id,
    platform: "etsy",
    seller_id: null,
  });

  return NextResponse.redirect("/(app)/connect?etsy=connected");
}
