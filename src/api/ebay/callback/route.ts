// app/api/ebay/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, marketName: string) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    // handle user cancel or error
    return NextResponse.redirect("/?ebay_error=" + encodeURIComponent(error));
  }
  if (!code || !state)
    return NextResponse.redirect("/?ebay_error=missing_code_state");

  const cookies = req.cookies;
  const savedState = cookies.get("ebay_oauth_state")?.value;
  const codeVerifier = cookies.get("ebay_code_verifier")?.value;
  if (!savedState || savedState !== state || !codeVerifier) {
    return NextResponse.redirect("/?ebay_error=invalid_state");
  }

  const env = process.env.EBAY_ENV === "sandbox" ? "sandbox" : "prod";
  const tokenEndpoint = `https://api.${
    env === "sandbox" ? "sandbox." : ""
  }ebay.com/identity/v1/oauth2/token`;
  const clientId = process.env.EBAY_CLIENT_ID!;
  const clientSecret = process.env.EBAY_CLIENT_SECRET!;
  const redirectUri = process.env.EBAY_REDIRECT_URI!;

  // exchange code → tokens
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const tokenResp = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!tokenResp.ok) {
    const txt = await tokenResp.text();
    return NextResponse.redirect("/?ebay_error=token_exchange_failed");
  }

  const tokenJson = await tokenResp.json();
  const accessToken: string = tokenJson.access_token;
  const refreshToken: string = tokenJson.refresh_token;
  const expiresIn: number = tokenJson.expires_in; // seconds

  // (optional) identify seller (username, userId) via Identity API
  const identityResp = await fetch(
    `https://apiz.${
      env === "sandbox" ? "sandbox." : ""
    }ebay.com/commerce/identity/v1/user`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  let sellerId: string | null = null;
  if (identityResp.ok) {
    const j = await identityResp.json();
    sellerId = j?.username ?? j?.userId ?? null;
  }

  // store in Supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect("/sign-in");

  // Upsert the 'ebay' marketplace for this user (you can choose your own naming rules)
  const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  await supabase.from("marketplace_accounts").upsert(
    {
      user_id: user.id,
      platform: "ebay",
      marketplace_name: marketName, // or the name the user just provided in your dialog
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: tokenExpiresAt,
      seller_id: sellerId,
      status: "active",
    },
    { onConflict: "user_id,platform" }
  ); // if you put a unique constraint on (user_id, platform)

  // clear cookies & return to app
  const res = NextResponse.redirect("/");
  res.cookies.delete("ebay_oauth_state");
  res.cookies.delete("ebay_code_verifier");
  return res;
}
