import { parseISO } from "date-fns";

export function computeRollingTurnover(
  rows: {
    cash_date: string;
    amount_pence: number;
    type: string;
    is_personal: boolean;
  }[],
  thresholdPence = 90000_00 // £90,000 default
) {
  // only include business sales & shipping income
  const sales = rows
    .filter(
      (r) =>
        !r.is_personal && (r.type === "sale" || r.type === "shipping_income")
    )
    .map((r) => ({ d: parseISO(r.cash_date).getTime(), v: r.amount_pence }));

  sales.sort((a, b) => a.d - b.d);

  let maxRolling = 0;
  const window: { d: number; v: number }[] = [];
  let rolling = 0;
  const yearMs = 365 * 24 * 60 * 60 * 1000;

  for (const s of sales) {
    window.push(s);
    rolling += s.v;
    while (window.length && s.d - window[0].d > yearMs) {
      const first = window.shift()!;
      rolling -= first.v;
    }
    if (rolling > maxRolling) maxRolling = rolling;
  }

  const near = maxRolling >= thresholdPence * 0.8;
  const crossed = maxRolling >= thresholdPence;

  return { maxRollingPence: maxRolling, near, crossed };
}
