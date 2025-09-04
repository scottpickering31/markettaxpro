export function ConfidenceBadge({ rows }: { rows: { cash_date: string }[] }) {
  if (!rows.length)
    return <span className="text-xs text-gray-500">No data yet</span>;

  const months = new Set(rows.map((r) => r.cash_date.slice(0, 7)));
  const hasGaps = months.size < 12;
  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        hasGaps
          ? "bg-yellow-100 text-yellow-800"
          : "bg-green-100 text-green-800"
      }`}
    >
      {hasGaps ? "Data incomplete" : "Data looks good"}
    </span>
  );
}
