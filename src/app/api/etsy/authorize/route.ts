import { NextResponse } from "next/server";

// Fill with your Etsy app creds in env; this is a stubbed redirect
export async function GET() {
  const clientId = process.env.ETSY_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/etsy/callback`;
  const scope = "transactions_r%20shops_r%20listings_r";
  const url = `https://www.etsy.com/oauth/connect?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scope}`;
  return NextResponse.redirect(url);
}
