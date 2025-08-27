import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getRouteSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const user = await requireUser();
  const { ids, is_personal } = await req.json();
  if (!Array.isArray(ids) || typeof is_personal !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const supabase = getRouteSupabase();
  const { error } = await supabase
    .from("transactions")
    .update({ is_personal })
    .in("id", ids)
    .eq("user_id", user.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ updated: ids.length });
}
