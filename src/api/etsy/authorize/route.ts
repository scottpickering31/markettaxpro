import { NextResponse } from "next/server";

export async function GET() {
  const url = new URL("https://www.etsy.com/oauth/connect");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", `${process.env.ETSY_REDIRECT_URI}`);
  url.searchParams.set("scope", "transactions_r payments_r");
  url.searchParams.set("client_id", process.env.ETSY_CLIENT_ID!);
  return NextResponse.redirect(url.toString());
}
