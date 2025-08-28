import { requireUser } from "@/src/lib/auth";
import { listTransactions } from "@/src/lib/db/queries";
import { currentTaxYear, taxYearRange, inRangeISO } from "@/src/lib/dates";
import TransactionsTable from "@/src/components/tables/TransactionsTable";

export default async function TransactionsPage() {
  const user = await requireUser();
  const taxYear = currentTaxYear();
  const rows = await listTransactions(user.id, taxYear);
  const { start, end } = taxYearRange(taxYear);
  const inYear = rows.filter((r) => inRangeISO(r.cash_date, start, end));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <p className="text-sm text-gray-600">
        Showing {inYear.length} rows for {taxYear}
      </p>
      <TransactionsTable rows={inYear as any} />
    </div>
  );
}
