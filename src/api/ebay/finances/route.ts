import { NextResponse } from "next/server";
import { getUserInRoute } from "@/lib/auth-route";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const user = await getUserInRoute();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("marketplace_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("platform", "ebay")
    .single();

  if (!accounts?.access_token)
    return NextResponse.json({ error: "No eBay connected" }, { status: 400 });

  // TODO: call eBay finances API
  return NextResponse.json({ ok: true, message: "eBay sync stub" });
}
