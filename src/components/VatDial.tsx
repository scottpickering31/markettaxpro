"use client";
import { useMemo } from "react";

export function VatDial({
  rows,
}: {
  rows: { cash_date: string; amount_pence: number; type: string }[];
}) {
  // Simplified rolling turnover calculation
  const threshold = 90000_00; // £90k in pence
  const total = useMemo(() => {
    return rows
      .filter((r) => r.type === "sale")
      .reduce((acc, r) => acc + r.amount_pence, 0);
  }, [rows]);
  const pct = Math.min(100, Math.round((total / threshold) * 100));

  return (
    <div className="rounded border p-4">
      <h2 className="font-medium mb-2">VAT Turnover</h2>
      <div className="text-lg">{(total / 100).toFixed(2)} / 90,000.00</div>
      <div className="w-full bg-gray-200 rounded h-2 mt-2">
        <div
          className="bg-green-600 h-2 rounded"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct >= 100 && (
        <p className="text-red-600 text-sm mt-2">
          You’ve crossed the VAT threshold!
        </p>
      )}
    </div>
  );
}
