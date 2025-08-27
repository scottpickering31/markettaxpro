import { addDays, isAfter, isBefore, parseISO } from "date-fns";

export function currentTaxYear(today = new Date()): string {
  const year = today.getFullYear();
  const startsThis = new Date(year, 3, 6); // 6 Apr
  if (isBefore(today, startsThis)) {
    // before Apr 6 -> previous tax year start
    return `${year - 1}-${String(year).slice(-2)}`;
  }
  return `${year}-${String(year + 1).slice(-2)}`;
}

export function taxYearRange(taxYear: string) {
  // '2024-25' -> start 2024-04-06 to 2025-04-05
  const [y1, y2] = taxYear
    .split("-")
    .map((p, i) => (i === 0 ? parseInt(p, 10) : 2000 + parseInt(p, 10)));
  const start = new Date(y1, 3, 6);
  const end = new Date(y2, 3, 5);
  return { start, end };
}

export function inRangeISO(isoDate: string, start: Date, end: Date) {
  const d = parseISO(isoDate);
  return isAfter(d, addDays(start, -1)) && isBefore(d, addDays(end, 1));
}
