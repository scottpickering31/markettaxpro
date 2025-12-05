// app/api/ebay/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/http/getOrigin";

export async function GET(req: NextRequest) {
  const origin = getOrigin(req);

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/?ebay_error=${encodeURIComponent(error)}`, origin)
      );
    }
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/?ebay_error=missing_code_state", origin)
      );
    }

    const cookies = req.cookies;
    const savedState = cookies.get("ebay_oauth_state")?.value;
    const codeVerifier = cookies.get("ebay_code_verifier")?.value;
    if (!savedState || savedState !== state || !codeVerifier) {
      return NextResponse.redirect(
        new URL("/?ebay_error=invalid_state", origin)
      );
    }

    const env = process.env.EBAY_ENV === "sandbox" ? "sandbox" : "prod";
    const tokenEndpoint = `https://api.${
      env === "sandbox" ? "sandbox." : ""
    }ebay.com/identity/v1/oauth2/token`;
    const clientId = process.env.EBAY_CLIENT_ID!;
    const clientSecret = process.env.EBAY_CLIENT_SECRET!;
    const ruName = process.env.EBAY_RU_NAME!;

    // Exchange code → tokens
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: ruName,
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
      console.error("[ebay/callback] token exchange failed:", txt);
      return NextResponse.redirect(
        new URL("/?ebay_error=token_exchange_failed", origin)
      );
    }

    const tokenJson = await tokenResp.json();
    const accessToken: string = tokenJson.access_token;
    const refreshToken: string | undefined = tokenJson.refresh_token;
    const expiresIn: number = tokenJson.expires_in;

    // Identify seller
    const identityResp = await fetch(
      `https://apiz.${
        env === "sandbox" ? "sandbox." : ""
      }ebay.com/commerce/identity/v1/user`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!identityResp.ok) {
      const txt = await identityResp.text();
      console.error("[ebay/callback] identity failed:", txt);
      return NextResponse.redirect(
        new URL("/?ebay_error=identity_failed", origin)
      );
    }

    const ident = await identityResp.json();
    const sellerId: string | null = ident?.username ?? ident?.userId ?? null;
    if (!sellerId) {
      return NextResponse.redirect(
        new URL("/?ebay_error=no_seller_id", origin)
      );
    }

    // Store in Supabase
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/sign-in", origin));

    const tokenExpiresAt = new Date(
      Date.now() + expiresIn * 1000
    ).toISOString();

    // Upsert per (user_id, platform, seller_id)

    const { data: existing } = await supabase
      .from("marketplace_accounts")
      .select("id")
      .eq("user_id", user.id)
      .eq("platform", "ebay")
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (existing) {
      return NextResponse.redirect(
        new URL("/dashboard?ebay_error=already_connected", origin)
      );
    }
    const { error: dbErr } = await supabase
      .from("marketplace_accounts")
      .insert({
        user_id: user.id,
        platform: "ebay",
        seller_id: sellerId,
        marketplace_name: `eBay (${sellerId})`,
        access_token: accessToken,
        refresh_token: refreshToken ?? null,
        token_expires_at: tokenExpiresAt,
        status: "active",
        connected_at: new Date().toISOString(),
      });

    if (dbErr) {
      return NextResponse.redirect(
        new URL("/?ebay_error=db_upsert_failed", origin)
      );
    }

    const res = NextResponse.redirect(new URL("/?connected=ebay", origin));
    res.cookies.delete("ebay_oauth_state");
    res.cookies.delete("ebay_code_verifier");
    return res;
  } catch (e) {
    return NextResponse.redirect(new URL("/?ebay_error=server_500", origin));
  }
}
