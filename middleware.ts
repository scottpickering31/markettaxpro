import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/:path*",
    "/connect/:path*",
    "/costs/:path*",
    "/export/:path*",
    "/transactions/:path*",
    "/account/:path*",
  ],
};
