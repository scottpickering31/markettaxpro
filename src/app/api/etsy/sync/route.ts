import { NextResponse } from "next/server";
import { requireUser } from "@/src/lib/auth";
import { insertTransactions, recomputeYearSummary } from "@/src/lib/db/queries";
import { currentTaxYear } from "@/src/lib/dates";

export async function POST() {
  const user = await requireUser();

  // TODO: call Etsy API with stored access token → map to normalized rows
  const mapped = [
    // Example:
    // { platform: 'etsy', order_id: '123', cash_date: '2025-04-10', type: 'sale', amount_pence: 2500, currency: 'GBP', notes: null, is_personal: false, source: 'api', source_ref: 'etsy:123' }
  ];

  if (mapped.length) {
    await insertTransactions(user.id, mapped as any);
    await recomputeYearSummary(user.id, currentTaxYear());
  }

  return NextResponse.json({ imported: mapped.length });
}
