import { formatGBP } from "@/src/lib/calc/summary";

export default async function DashboardPage() {
  // Placeholder totals (Batch B will query DB)
  const gross = 521200; // £5,212.00
  const costs = 135000; // £1,350.00
  const profit = Math.max(0, gross - costs);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Sales (YTD)" value={formatGBP(gross)} />
        <StatCard label="Costs & Fees" value={formatGBP(costs)} />
        <StatCard label="Profit (for tax)" value={formatGBP(profit)} />
      </div>
      <p className="text-sm text-gray-600">
        Connect your shops or upload CSVs to update these figures. We’ll compute
        the simple £1,000-off method vs. your real costs and recommend the
        cheaper tax base.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
