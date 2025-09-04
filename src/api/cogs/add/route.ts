import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { CogsSchema, toPence } from "@/lib/validators/cogs";
import { addCogs } from "@/lib/db/expenses";
import { recomputeYearSummary } from "@/lib/db/queries";
import { currentTaxYear } from "@/lib/dates";

export async function POST(req: Request) {
  const user = await requireUser();
  const data = await req.json();
  const parsed = CogsSchema.safeParse(data);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { method, amountGBP, orderId, sku, notes } = parsed.data;
  await addCogs(user.id, {
    method,
    amount_pence: toPence(amountGBP),
    order_id: orderId,
    sku,
    notes,
  });
  await recomputeYearSummary(user.id, currentTaxYear());

  return NextResponse.json({ ok: true });
}
