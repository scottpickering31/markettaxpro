// app/api/ebay/callback/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/http/getOrigin"; // 👈 import this
import { exchangeCodeForTokens, fetchEbayIdentity } from "@/lib/ebay/oauth";
import { readPkceCookies, clearPkceCookies } from "@/lib/ebay/cookies";
import { upsertMarketplaceAccount } from "@/lib/marketplaces/accounts";

export async function GET(req: NextRequest) {
  const origin = getOrigin(req);

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const errorParam = url.searchParams.get("error");

    if (errorParam) {
      return NextResponse.redirect(
        new URL(`/?ebay_error=${encodeURIComponent(errorParam)}`, origin)
      );
    }
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/?ebay_error=missing_code_state", origin)
      );
    }

    const { state: savedState, codeVerifier } = readPkceCookies(req);
    if (!savedState || savedState !== state || !codeVerifier) {
      return NextResponse.redirect(
        new URL("/?ebay_error=invalid_state", origin)
      );
    }

    // 1) Exchange code → tokens
    const tokenJson = await exchangeCodeForTokens(code, codeVerifier);
    const accessToken = tokenJson.access_token;
    const refreshToken = tokenJson.refresh_token;
    const expiresIn = tokenJson.expires_in;

    // 2) Identify seller
    const identity = await fetchEbayIdentity(accessToken);
    const sellerId = (identity.username ?? identity.userId) as string | null;

    if (!sellerId) {
      return NextResponse.redirect(
        new URL("/?ebay_error=no_seller_id", origin)
      );
    }

    // 3) Ensure we have an authenticated app user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", origin));
    }

    // 4) Store account
    const { alreadyConnected } = await upsertMarketplaceAccount({
      userId: user.id,
      platform: "ebay",
      sellerId,
      marketplaceName: `eBay (${sellerId})`,
      accessToken,
      refreshToken,
      expiresIn,
    });

    if (alreadyConnected) {
      return NextResponse.redirect(
        new URL("/dashboard?ebay_error=already_connected", origin)
      );
    }

    // 5) Final redirect
    const res = NextResponse.redirect(new URL("/?connected=ebay", origin));
    clearPkceCookies(res);
    return res;
  } catch (err) {
    console.error("[ebay/callback] unexpected error:", err);
    return NextResponse.redirect(new URL("/?ebay_error=server_500", origin));
  }
}
