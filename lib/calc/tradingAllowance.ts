/**
 * Trading allowance (UK):
 * - Up to £1,000 can be deducted from gross trading income instead of claiming expenses.
 * - You cannot combine allowance and expenses.
 * - The allowance cannot create a loss.
 */

export function applyTradingAllowance(grossSalesPence: number): {
  taxableProfitPence: number;
  allowanceAppliedPence: number;
} {
  const ALLOWANCE = 1000_00; // £1,000 in pence
  if (grossSalesPence <= 0) {
    return { taxableProfitPence: 0, allowanceAppliedPence: 0 };
  }
  const deduction = Math.min(ALLOWANCE, grossSalesPence);
  const profit = Math.max(0, grossSalesPence - deduction);
  return { taxableProfitPence: profit, allowanceAppliedPence: deduction };
}
