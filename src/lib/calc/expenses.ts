/**
 * Totals the “real expenses” route:
 * - platform fees (negative amounts)
 * - shipping labels you paid (negative)
 * - COGS (positive expense values)
 * - manual expenses categories
 */

export type ExpenseTotals = {
  feesPence: number;            // platform/payment fees
  shippingLabelsPence: number;  // postage labels purchased
  cogsPence: number;            // cost of goods sold
  manualPence: number;          // other expenses (packaging, travel, etc.)
  totalPence: number;
};

export function sumExpenses(input: Omit<ExpenseTotals, "totalPence">): ExpenseTotals {
  const totalPence =
    (input.feesPence || 0) +
    (input.shippingLabelsPence || 0) +
    (input.cogsPence || 0) +
    (input.manualPence || 0);
  return { ...input, totalPence };
}
