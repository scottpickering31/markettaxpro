// lib/http/get-origin.ts
import type { NextRequest } from "next/server";

export function getOrigin(req: NextRequest) {
  if (process.env.PUBLIC_ORIGIN) return process.env.PUBLIC_ORIGIN;
  const xfProto = req.headers.get("x-forwarded-proto");
  const xfHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (xfProto && xfHost) return `${xfProto}://${xfHost}`;
  return new URL(req.url).origin;
}
