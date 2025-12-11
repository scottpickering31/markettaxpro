import { getEbayApiBase, getEbayClientCreds, getEbayRuName } from "./config";

export type EbayTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  refresh_token_expires_in?: number;
  token_type: string;
};

export async function exchangeCodeForTokens(code: string, codeVerifier: string) {
  const apiBase = getEbayApiBase();
  const tokenEndpoint = `${apiBase}/identity/v1/oauth2/token`;
  const { clientId, clientSecret } = getEbayClientCreds();
  const ruName = getEbayRuName();

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: ruName,
    code_verifier: codeVerifier,
  });

  const resp = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`[ebay] token exchange failed: ${txt}`);
  }

  const json = (await resp.json()) as EbayTokenResponse;
  return json;
}

export type EbayIdentity = {
  username?: string;
  userId?: string;
  [key: string]: any;
};

export async function fetchEbayIdentity(accessToken: string): Promise<EbayIdentity> {
  // You could also make apiz base configurable if you want
  const resp = await fetch("https://apiz.ebay.com/commerce/identity/v1/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`[ebay] identity failed: ${txt}`);
  }

  return resp.json();
}
