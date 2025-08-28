// app/api/export/csv/route.ts
import { NextResponse } from "next/server";
import { getUserInRoute } from "@/src/lib/auth-route";
import { listTransactions } from "@/src/lib/db/queries";
import { currentTaxYear, taxYearRange, inRangeISO } from "@/src/lib/dates";

export const runtime = "nodejs";

export async function GET() {
  const user = await getUserInRoute();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const taxYear = currentTaxYear();
  const rows = await listTransactions(user.id, taxYear);
  const { start, end } = taxYearRange(taxYear);
  const inYear = rows.filter((r) => inRangeISO(r.cash_date, start, end));

  const header = [
    "date",
    "orderId",
    "platform",
    "type",
    "amountPence",
    "currency",
    "notes",
  ].join(",");
  const lines = inYear.map((r) =>
    [
      r.cash_date,
      r.order_id ?? "",
      r.platform,
      r.type,
      String(r.amount_pence),
      r.currency ?? "GBP",
      (r.notes ?? "").replace(/[\r\n,]/g, " "),
    ].join(",")
  );

  const body = [header, ...lines].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="transactions-${taxYear}.csv"`,
    },
  });
}
