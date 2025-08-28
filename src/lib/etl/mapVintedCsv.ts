import { NormalizedRow } from "@/src/lib/csv/parse";

export function mapVintedCsv(rows: NormalizedRow[]) {
  return rows.map((r) => ({
    platform: "vinted" as const,
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
