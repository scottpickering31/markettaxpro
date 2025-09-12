// src/app/(auth)/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const url = new URL(request.url);
  const target = next.startsWith("/") ? next : "/";
  const res = NextResponse.redirect(new URL(target, request.url));

  console.log("Callback code 1" + code);

  const supabase = await createClient();

  try {
    if (code) {
      // OAuth / PKCE style callback
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      return res;
    }
    return NextResponse.redirect(
      new URL("/sign-in?error=missing_callback_params", url)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
