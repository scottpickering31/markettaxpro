import type { NextRequest, NextResponse } from "next/server";

const STATE_COOKIE = "ebay_oauth_state";
const VERIFIER_COOKIE = "ebay_code_verifier";

export function readPkceCookies(req: NextRequest) {
  const cookies = req.cookies;
  const state = cookies.get(STATE_COOKIE)?.value;
  const codeVerifier = cookies.get(VERIFIER_COOKIE)?.value;
  return { state, codeVerifier };
}

export function clearPkceCookies(res: NextResponse) {
  res.cookies.delete(STATE_COOKIE);
  res.cookies.delete(VERIFIER_COOKIE);
}
