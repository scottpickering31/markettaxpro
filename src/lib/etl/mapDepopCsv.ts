import { NormalizedRow } from "@/src/lib/csv/parse";

// Adjust if Depop headers differ in your export
export function mapDepopCsv(rows: NormalizedRow[]) {
  return rows.map((r) => ({
    platform: "depop" as const,
    order_id: r.orderId,
    cash_date: r.date.slice(0, 10),
    type: r.type,
    amount_pence: r.amountPence,
    currency: r.currency || "GBP",
    notes: r.notes ?? null,
    is_personal: false,
    source: "csv" as const,
    source_ref: null,
  }));
}
