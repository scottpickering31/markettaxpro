// lib/ebay/tokens.ts
export async function refreshEbayTokenIfNeeded(row: {
  refresh_token: string | null;
  token_expires_at: string | null;
}) {
  const { refresh_token, token_expires_at } = row;
  if (!refresh_token || !token_expires_at) return null;

  const soon = Date.now() + 2 * 60 * 1000;
  if (new Date(token_expires_at).getTime() > soon) return null; // still valid

  const env = process.env.EBAY_API_URI;
  const tokenEndpoint = `${env}/identity/v1/oauth2/token`;
  const basic = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
    // If you requested very granular scopes originally, include them here as well (eBay requires scopes on refresh)
    scope: [
      "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.finances.readonly",
    ].join(" "),
  });

  const resp = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!resp.ok) return null;
  const j = await resp.json();
  return {
    access_token: j.access_token as string,
    expires_in: j.expires_in as number,
  };
}
