import { NextResponse } from "next/server";
import { getRouteSupabase } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect("/(app)/connect?error=missing_code");

  // Exchange code → token; store securely (not shown)
  const supabase = getRouteSupabase();
  await supabase.from("marketplace_accounts").insert({
    user_id: user.id,
    platform: "ebay",
    seller_id: null
  });

  return NextResponse.redirect("/(app)/connect?ebay=connected");
}
