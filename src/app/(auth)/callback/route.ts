import { NextResponse } from "next/server";
import { getRouteSupabase } from "@/src/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = getRouteSupabase();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL("/app", request.url));
  }
  return NextResponse.redirect(
    new URL("/sign-in?error=missing_code", request.url)
  );
}
