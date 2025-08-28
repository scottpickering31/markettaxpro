export function toPence(amountGBP: number) {
  return Math.round(amountGBP * 100);
}
export function fromPence(p: number) {
  return (p / 100).toFixed(2);
}
export function formatGBP(p: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(p / 100);
}
