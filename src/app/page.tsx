import { computeSummary, formatGBP } from "@/lib/calc/summary";
import { sumExpenses } from "@/lib/calc/expenses";
import { listTransactions } from "@/lib/db/queries";
import { requireUser } from "@/lib/auth";
import { currentTaxYear, taxYearRange, inRangeISO } from "@/lib/dates";
import { VatDial } from "@/components/VatDial";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

export default async function SummaryPage() {
  const user = await requireUser();
  const taxYear = currentTaxYear();
  const rows = await listTransactions(user.id, taxYear);
  const { start, end } = taxYearRange(taxYear);
  const inYear = rows.filter((r) => inRangeISO(r.cash_date, start, end));

  // compute totals as before
  const expenseTotals = sumExpenses({
    feesPence: 65000,
    shippingLabelsPence: 30000,
    cogsPence: 50000,
    manualPence: 20000,
  });
  const result = computeSummary({ grossSalesPence: 521200, expenseTotals });

  const gross = inYear
    .filter(
      (r) =>
        !r.is_personal && (r.type === "sale" || r.type === "shipping_income")
    )
    .reduce((a, r) => a + r.amount_pence, 0);

  return (
    <div className="space-y-6">
      <h1> Welcome, {user.email}</h1>
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        Summary <ConfidenceBadge rows={inYear} />
      </h1>

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
        <VatDial rows={inYear} />
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
