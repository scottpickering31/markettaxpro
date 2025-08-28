import { applyTradingAllowance } from "./tradingAllowance";
import { ExpenseTotals } from "./expenses";

export type Method = "allowance" | "expenses";

export function pennies(n: number) {
  return Math.round(n);
}

export function formatGBP(pence: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
}

/**
 * Computes both methods and recommends the lower taxable profit.
 */
export function computeSummary({
  grossSalesPence,
  expenseTotals
}: {
  grossSalesPence: number;
  expenseTotals: ExpenseTotals;
}): {
  allowance: { taxableProfitPence: number; allowanceAppliedPence: number };
  expenses: { taxableProfitPence: number; expensesPence: number };
  recommended: Method;
} {
  const allow = applyTradingAllowance(grossSalesPence);
  const expProfit = Math.max(0, grossSalesPence - expenseTotals.totalPence);
  const recommended: Method = expProfit <= allow.taxableProfitPence ? "expenses" : "allowance";

  return {
    allowance: allow,
    expenses: { taxableProfitPence: expProfit, expensesPence: expenseTotals.totalPence },
    recommended
  };
}
