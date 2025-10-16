// app/api/ebay/start/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const SCOPES = [
  "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.finances.readonly",
];

function base64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeCodeVerifier() {
  return base64url(crypto.randomBytes(32));
}
function makeCodeChallenge(verifier: string) {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return base64url(hash);
}

export async function GET() {
  const clientId = process.env.EBAY_CLIENT_ID!;
  const redirectUri = process.env.EBAY_REDIRECT_URI!;
  const env = process.env.EBAY_ENV === "sandbox" ? "sandbox" : "prod";

  const codeVerifier = makeCodeVerifier();
  const codeChallenge = makeCodeChallenge(codeVerifier);
  const state = base64url(crypto.randomBytes(16));

  // Persist verifier + state in cookies (HTTPOnly) or your session store.
  const res = NextResponse.redirect(
    `https://auth.${env === "sandbox" ? "sandbox." : ""}ebay.com/oauth2/authorize` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(SCOPES.join(" "))}` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`
  );
  res.cookies.set("ebay_oauth_state", state, { httpOnly: true, sameSite: "lax", path: "/" });
  res.cookies.set("ebay_code_verifier", codeVerifier, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}
