// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookies) {
          for (const { name, value, options } of cookies) {
            res.cookies.set({ name, value, ...options });
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  const isProtected = pathname.startsWith("/app");
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/callback");

  // 1) Gate /app for signed-out users
  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 2) Optional: if signed-in and visiting "/", send them to /app
  if (pathname === "/" && user) {
    console.log("user", user);
    const url = req.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*|favicon.ico).*)"],
};
