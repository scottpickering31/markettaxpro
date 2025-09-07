import { NextResponse } from "next/server";
import { getUserInRoute } from "@/lib/auth-route";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const user = await getUserInRoute();
  if (!user) return NextResponse.redirect("/(auth)/sign-in");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect("/(app)/connect?error=etsy_no_code");

  // Exchange code for access_token
  const res = await fetch("https://openapi.etsy.com/v3/public/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.ETSY_CLIENT_ID!,
      client_secret: process.env.ETSY_CLIENT_SECRET!,
      redirect_uri: `${process.env.ETSY_REDIRECT_URI}`,
      code,
    }),
  });
  const token = await res.json();
  if (!token.access_token) {
    console.error("Etsy token error", token);
    return NextResponse.redirect("/(app)/connect?error=etsy_token");
  }

  // Save in DB
  const supabase = await createClient();
  await supabase.from("marketplace_accounts").insert({
    user_id: user.id,
    platform: "etsy",
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  });

  return NextResponse.redirect("/(app)/connect?success=etsy");
}
