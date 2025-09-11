import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/",
    "/csv-export/:path*",
    "/pdf-export/:path*",
    "/account/:path*",
    "/billing/:path*",
    "/connect/:path*",
    "/costs/:path*",
    "/import/:path*",
    "/transactions/:path*",
  ],
};
