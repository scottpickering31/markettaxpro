import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.EBAY_CLIENT_ID!;
  const redirectUri = process.env.EBAY_REDIRECT_URI!; // Must match eBay app settings
  const scope = encodeURIComponent("https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.finances.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly");
  const url = `https://auth.ebay.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  return NextResponse.redirect(url);
}
