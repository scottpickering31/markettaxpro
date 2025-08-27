import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { currentTaxYear } from "@/lib/dates";
import { listYearSummary, recomputeYearSummary } from "@/lib/db/queries";
import { buildSummaryPdf } from "@/lib/pdf/template";

export const runtime = "nodejs";

export async function GET() {
  const user = await requireUser();
  const year = currentTaxYear();
  const data =
    (await listYearSummary(user.id, year)) ??
    (await recomputeYearSummary(user.id, year));

  const gross =
    (data.gross_sales_pence ?? 0) + (data.shipping_income_pence ?? 0);
  const expenses =
    Math.abs(data.fees_pence ?? 0) +
    Math.abs(data.shipping_labels_pence ?? 0) +
    Math.abs(data.cogs_pence ?? 0) +
    Math.abs(data.manual_pence ?? 0);
  const profitReal = gross - expenses;
  const profitAllowance = Math.max(0, gross - 1000_00);
  const recommended = profitReal <= profitAllowance ? "expenses" : "allowance";

  const pdf = await buildSummaryPdf({
    userEmail: user.email ?? user.id,
    year,
    grossPence: gross,
    expensesPence: expenses,
    profitRealPence: profitReal,
    profitAllowancePence: profitAllowance,
    recommended,
  });

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="summary-${year}.pdf"`,
    },
  });
}
