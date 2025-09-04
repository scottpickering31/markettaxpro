import { NextResponse } from "next/server";
import { getUserInRoute } from "@/lib/auth-route";
import { getRouteSupabase } from "@/lib/supabase/server";

export async function POST() {
  const user = await getUserInRoute();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getRouteSupabase();
  const { data: accounts } = await supabase
    .from("marketplace_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("platform", "etsy")
    .single();

  if (!accounts?.access_token)
    return NextResponse.json({ error: "No Etsy connected" }, { status: 400 });

  // TODO: fetch Etsy orders/payments
  // const res = await fetch("https://openapi.etsy.com/v3/application/shops/xxx/transactions", { headers: { Authorization: `Bearer ${accounts.access_token}` } })

  return NextResponse.json({ ok: true, message: "Etsy sync stub" });
}
