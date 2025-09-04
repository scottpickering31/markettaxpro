import { NextResponse } from "next/server";

export async function GET() {
  const url = new URL("https://auth.ebay.com/oauth2/authorize");
  url.searchParams.set("client_id", process.env.EBAY_CLIENT_ID!);
  url.searchParams.set("redirect_uri", process.env.EBAY_REDIRECT_URI!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set(
    "scope",
    "https://api.ebay.com/oauth/api_scope/sell.finances"
  );
  return NextResponse.redirect(url.toString());
}
