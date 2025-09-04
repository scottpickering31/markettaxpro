import { NextResponse } from "next/server";
import { getUserInRoute } from "@/lib/auth-route";
import { getRouteSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const user = await getUserInRoute();
  if (!user) return NextResponse.redirect("/(auth)/sign-in");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect("/(app)/connect?error=ebay_no_code");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.EBAY_REDIRECT_URI!,
  });

  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const token = await res.json();

  const supabase = getRouteSupabase();
  await supabase.from("marketplace_accounts").insert({
    user_id: user.id,
    platform: "ebay",
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  });

  return NextResponse.redirect("/(app)/connect?success=ebay");
}
