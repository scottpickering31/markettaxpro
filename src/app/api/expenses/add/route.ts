import { NextResponse } from "next/server";
import { requireUser } from "@/src/lib/auth";
import { ManualExpenseSchema, toPence } from "@/src/lib/validators/expenses";
import { addManualExpense } from "@/src/lib/db/expenses";
import { recomputeYearSummary } from "@/src/lib/db/queries";
import { currentTaxYear } from "@/src/lib/dates";

export async function POST(req: Request) {
  const user = await requireUser();
  const data = await req.json();
  const parsed = ManualExpenseSchema.safeParse(data);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { date, category, amountGBP, note } = parsed.data;
  await addManualExpense(user.id, {
    date,
    category,
    amount_pence: toPence(amountGBP),
    note,
  });
  await recomputeYearSummary(user.id, currentTaxYear());

  return NextResponse.json({ ok: true });
}
