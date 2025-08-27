import { parse } from "csv-parse/sync";
import { z } from "zod";

/**
 * Expected minimal CSV headers:
 * date, order_id, type, amount, currency, notes
 * Example types: sale, fee, shipping_income, shipping_label, refund
 */
const Row = z.object({
  date: z.string(),
  order_id: z.string(),
  type: z.enum([
    "sale",
    "fee",
    "shipping_income",
    "shipping_label",
    "refund",
    "other_expense",
  ]),
  amount: z.string(), // parse to number later
  currency: z.string().default("GBP"),
  notes: z.string().optional(),
});

export type NormalizedRow = {
  date: string; // ISO date (as provided)
  orderId: string;
  type: z.infer<typeof Row>["type"];
  amountPence: number; // in pence; negative for expenses/fees/refunds
  currency: string;
  notes?: string;
};

export function parseSalesCsv(fileBuffer: Buffer): NormalizedRow[] {
  const raw = parse(fileBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const rows: NormalizedRow[] = [];
  for (const r of raw) {
    const parsed = Row.safeParse(r);
    if (!parsed.success) continue;
    const { date, order_id, type, amount, currency, notes } = parsed.data;

    // amount to pence
    const num = Number(String(amount).replace(/[, ]/g, ""));
    if (Number.isNaN(num)) continue;
    const sign = type === "sale" || type === "shipping_income" ? 1 : -1;
    const pence = Math.round(Math.abs(num) * 100) * sign;

    rows.push({
      date,
      orderId: order_id,
      type,
      amountPence: pence,
      currency: currency || "GBP",
      notes,
    });
  }
  return rows;
}
