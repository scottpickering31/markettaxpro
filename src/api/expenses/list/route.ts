import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("manual_expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
