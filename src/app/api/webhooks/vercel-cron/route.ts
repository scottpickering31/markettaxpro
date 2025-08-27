import { NextResponse } from "next/server";
import { getRouteSupabase } from "@/lib/supabase/server";
import { recomputeYearSummary } from "@/lib/db/queries";
import { currentTaxYear } from "@/lib/dates";

// Vercel cron can call this endpoint nightly
export async function GET() {
  const supabase = getRouteSupabase();
  const { data: profiles } = await supabase.from("profiles").select("id");
  const year = currentTaxYear();

  let updated = 0;
  for (const p of profiles ?? []) {
    await recomputeYearSummary(p.id, year);
    updated++;
  }
  return NextResponse.json({ updated });
}
