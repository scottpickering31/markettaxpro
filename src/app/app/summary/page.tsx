import { requireUser } from "@/lib/auth";
import { listYearSummary, recomputeYearSummary } from "@/lib/db/queries";
import { currentTaxYear } from "@/lib/dates";
import { computeSummary, formatGBP } from "@/lib/calc/summary";
import { sumExpenses } from "@/lib/calc/expenses";

export default async function SummaryPage() {
  const user = await requireUser();
  const taxYear = currentTaxYear();
  const existing = await listYearSummary(user.id, taxYear);
  const sum = existing ?? (await recomputeYearSummary(user.id, taxYear));

  const gross = (sum.gross_sales_pence ?? 0) + (sum.shipping_income_pence ?? 0);
  const expenseTotals = sumExpenses({
    feesPence: Math.abs(sum.fees_pence ?? 0),
    shippingLabelsPence: Math.abs(sum.shipping_labels_pence ?? 0),
    cogsPence: Math.abs(sum.cogs_pence ?? 0),
    manualPence: Math.abs(sum.manual_pence ?? 0),
  });

  const result = computeSummary({ grossSalesPence: gross, expenseTotals });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Summary ({taxYear})</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Gross sales" value={formatGBP(gross)} />
        <Card
          title="Total costs (real)"
          value={formatGBP(expenseTotals.totalPence)}
        />
        <Card
          title="Recommended"
          value={
            result.recommended === "expenses"
              ? "Use real costs"
              : "Use £1,000 allowance"
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel
          title="Option A — £1,000 allowance"
          value={formatGBP(result.allowance.taxableProfitPence)}
          sub="(Cannot create a loss)"
        />
        <Panel
          title="Option B — Real expenses"
          value={formatGBP(result.expenses.taxableProfitPence)}
          sub={`Expenses counted: ${formatGBP(expenseTotals.totalPence)}`}
        />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
function Panel({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-medium mb-2">{title}</h2>
      <p>
        Taxable profit: <strong>{value}</strong>
      </p>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
