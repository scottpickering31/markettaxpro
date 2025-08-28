import { NextResponse } from "next/server";
import { requireUser } from "@/src/lib/auth";
import { insertTransactions, recomputeYearSummary } from "@/src/lib/db/queries";
import { currentTaxYear } from "@/src/lib/dates";

export async function POST() {
  const user = await requireUser();

  // TODO: call eBay Finances API (payouts/transactions) → map to normalized rows
  const mapped = [
    // { platform:'ebay', order_id:'ABC', cash_date:'2025-03-02', type:'fee', amount_pence:-120, currency:'GBP', notes:'eBay fee', is_personal:false, source:'api', source_ref:'ebay:tx:ABC' }
  ];

  if (mapped.length) {
    await insertTransactions(user.id, mapped as any);
    await recomputeYearSummary(user.id, currentTaxYear());
  }
  return NextResponse.json({ imported: mapped.length });
}
