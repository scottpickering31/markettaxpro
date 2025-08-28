import { NextResponse } from "next/server";
import { parseSalesCsv } from "@/src/lib/csv/parse";
import crypto from "crypto";
import { getRouteSupabase } from "@/src/lib/supabase/server";
import { requireUser } from "@/src/lib/auth";
import { mapDepopCsv } from "@/src/lib/etl/mapDepopCsv";
import { mapVintedCsv } from "@/src/lib/etl/mapVintedCsv";
import {
  insertTransactions,
  recomputeYearSummary,
  upsertProfile,
} from "@/src/lib/db/queries";
import { currentTaxYear } from "@/src/lib/dates";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const supabase = getRouteSupabase();

    // ensure profile exists
    await upsertProfile(user.id, user.email ?? "user@example.com");

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File))
      return NextResponse.json({ error: "Missing file" }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const sha = crypto.createHash("sha256").update(buf).digest("hex");

    // Stage raw file record
    await supabase.from("raw_files").insert({
      user_id: user.id,
      filename: file.name,
      bytes: buf.byteLength,
      sha256: sha,
    });

    const rows = parseSalesCsv(buf);

    // Simple platform detection by filename (change to UI toggle later)
    const lower = file.name.toLowerCase();
    let mapped;
    if (lower.includes("depop")) mapped = mapDepopCsv(rows);
    else if (lower.includes("vinted")) mapped = mapVintedCsv(rows);
    else
      mapped = rows.map((r) => ({
        platform: "csv" as const,
        order_id: r.orderId,
        cash_date: r.date.slice(0, 10),
        type: r.type,
        amount_pence: r.amountPence,
        currency: r.currency || "GBP",
        notes: r.notes ?? null,
        is_personal: false,
        source: "csv" as const,
        source_ref: sha,
      }));

    await insertTransactions(user.id, mapped);

    await recomputeYearSummary(user.id, currentTaxYear());

    return NextResponse.json({ rows: mapped.length });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
